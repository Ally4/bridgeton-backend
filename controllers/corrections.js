import Allcorrections from '../models/corrections';
import HttpError from '../helpers/errorsHandler/httpError';
import Productcorrections from '../models/productcorrections'
import 'dotenv/config';


/**
 * @exports
 * @class
 */
class CorrectionsController {
  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async createcorrection(req, res) {
    const {
      name,
      description,
      image
    } = req.body;

    let data = new Allcorrections({
      name,
      description,
      image
    });
    await data.save();
    res.status(201).json({
      status: 201,
      data,
    });
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async getcorrections(req, res) {
    const data = await Allcorrections.find({})
      .sort({
        date: -1
      });
    if (!data.length) {
      throw new HttpError(404, 'No collections available');
    }
    res.status(200).json({
      status: 200,
      collections: data
    });
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async getOnecorrection(req, res) {
    const {
      correctionId
    } = req.params;
    const data = await Allcorrections.findById(correctionId);
    const products = await Productcorrections.find({ correctionId })
    .sort({
      date: -1
    })
    .populate('product')
    .exec();
    res.status(200).json({
      status: 200,
      data,
      products
    });
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async updatecorrection(req, res) {
    const {
      body
    } = req;
    const {
      correctionId
    } = req.params;

    const data = await Allcorrections.findById(correctionId);

    Object.keys(body).forEach((key) => {
      data[key] = body[key];
    });

    await data.save();
    res.status(200).json({
      status: 200,
      data
    });
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async deleteOnecorrection(req, res) {
    const {
      correctionId
    } = req.params;
    const data = await Allcorrections.findById(correctionId);
    await data.remove();
    return res.status(200).json({
      status: 200,
      error: 'correction removed'
    });
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async addProductToCorrection(req, res) {
    const {
      product
    } = req.body;
    const {
      correctionId
    } = req.params

    let data = new Productcorrections({
      product,
      correctionId
    });
    data = await data.save();
    res.status(201).json({
      status: 201,
      data,
    });
  }

  /**
   * Remove product from a correction
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async removeProductInCorrection(req, res) {
    const {
      correctionId
    } = req.params;
    const {
      productId
    } = req.body
    const record = await Productcorrections.find({correctionId});
    await record.remove()
    return res.status(200).json({
      status: 200,
      meesage: 'product removed from this correction'
    });
  }
}


export default CorrectionsController;