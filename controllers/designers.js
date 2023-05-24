import Designers from '../models/designers';
import HttpError from '../helpers/errorsHandler/httpError';
import 'dotenv/config';
import Products from '../models/Products';


/**
 * @exports
 * @class
 */
class DesignersController {
  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async createDesigner(req, res) {
    const {
      userId, country, description
    } = req.body;

    const designer = new Designers({
      userId, country, description
    });
    const data = await designer.save();

    res.status(201).json({
      status: 201,
      data
    });
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async getDesigners(req, res) {
    const designers = await Designers.find({})
      .sort({
        date: -1
      })
      .populate('userId');
    if (!designers.length) {
      throw new HttpError(404, 'No designers available');
    }
    res.status(200).json({
      status: 200,
      designers
    });
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async getOneDesigner(req, res) {
    const {
      designerId
    } = req.params;
    const designer = await Designers.findById(designerId)
      .populate('userId');
    const products = await Products.find({ designer: designerId });
    res.status(200).json({
      status: 200,
      designer,
      products
    });
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async updateDesigner(req, res) {
    const {
      body
    } = req;
    const {
      designerId
    } = req.params;

    const designer = await Designers.findById(designerId);

    Object.keys(body).forEach((key) => {
      designer[key] = body[key];
    });

    await designer.save();
    res.status(200).json({
      status: 200,
      data: designer
    });
  }

  /**
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async designerProducts(req, res) {
    const {
      designerId
    } = req.params;
    const products = Products.find({ designer: designerId });
    return res.status(200).json({
      status: 200,
      products
    });
  }
}


export default DesignersController;
