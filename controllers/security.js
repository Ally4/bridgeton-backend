/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
import jwt from 'jsonwebtoken';
import httpError from '../helpers/errorsHandler/httpError';
import Security from '../models/Security';
import { questions } from './questions/questions.json';
import 'dotenv/config';
import User from '../models/User';

const challenges = [];
for (let i = 0; i < questions.length; i++) {
  challenges.push({
    number: i,
    question: questions[i],
    answer: '',
  });
}

/**
 * @exports
 * @class
 */

class Securities {
  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */

  async createSecurity(req, res) {
    try {
      const { number, answer } = req.body;
      const token = req.header('auth-token');
      const decoded = jwt.verify(token, process.env.jwtSecret);
      const user = await User.findById(decoded.user.id);
      const secUser = await Security.find({ user: user.id });
      if (!number || !answer || number > challenges.length) {
        return res.status(400).json({ error: 'please provide a valid question, number and answer' });
      }
      if (secUser.length > 0) {
        return res.status(409).json({ error: 'you have already created a security question' });
      }
      challenges[number].answer = answer;
      const newSecurity = new Security(
        {
          user: user._id,
          answer: challenges[number].answer,
          question: challenges[number].question,
          number
        }
      )
      const security = await newSecurity.save();
      return res.status(201).json({
        security,
        message: 'successfully added security question'
      });
    } catch (err) {
      return res.status(500).json({ error: 'failed to add security question' });
    }
  }

  async getSecurityQuestions(req, res) {
    return res.status(200).json({ questions: challenges });
  }

  async updateSecurityQuestion(req, res) {
    try {
      const { number, answer } = req.body;
      const { securityId } = req.params;
      if (!number || !answer || number > challenges.length) {
        return res.status(400).json({ error: 'please provide a valid question number and answer' });
      }
      challenges[number].answer = answer;
      await Security.findOneAndUpdate({ _id: securityId }, challenges[number]);
      return res.status(200).json({ challenge: challenges[number], message: 'successfully updated security question' });
    } catch (err) {
      return res.status(500).json({ error: 'failed to add security question' });
    }
  }
}

export default Securities;
