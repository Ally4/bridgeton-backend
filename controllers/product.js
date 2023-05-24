import Products from '../models/Products';
import HttpError from '../helpers/errorsHandler/httpError';
import 'dotenv/config';


/**
 * @exports
 * @class
 */
class ProductsController {
  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async createProducts(req, res) {
    const { categoryId } = req.params;
    const {
      title, description, price, designer
    } = req.body;
    const { files } = req;

    const data = {
      user: req.user.id,
      category: categoryId,
      title,
      description,
      price,
      designer
    };

    const frontImage = files && files.frontImage ? files.frontImage[0].location : null;
    const backImage = files && files.backImage ? files.backImage[0].location : null;

    if (frontImage) {
      data.frontImage = frontImage;
    }
    if (frontImage) {
      data.backImage = backImage;
    }

    if (files) {
      data.images = files && files.images ? files.images.map(file => file.location) : [];
    }

    const newProducts = new Products(data);
    const products = await newProducts.save();

    res.status(201).json({
      status: 201,
      products,
    });
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async getProducts(req, res) {
    const products = await Products.find({})
      .sort({
        date: -1
      })
      .populate('user', ['name', 'avatar'])
      .populate('category', ['title', 'description']);
    if (!products.length) {
      throw new HttpError(404, 'No available product for the moment');
    }
    res.status(200).json({
      status: 200,
      products
    });
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async getProductsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const products = await Products.find({ category: categoryId })
        .sort({
          date: -1
        })
        .populate('user', ['name', 'avatar'])
        .populate('category', ['title', 'description']);
      if (!products.length) {
        return res.status(404).json({ message: 'no products found at the moment' });
      }
      res.status(200).json({
        status: 200,
        products
      });
    } catch (err) {
      return res.status(500).json({
        error: 'failed to get products'
      });
    }
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async getOneProduct(req, res) {
    const { productId } = req.params;
    const products = await Products.findById(productId)
      .populate('user', ['name', 'avatar'])
      .populate('category', ['title', 'description'])
      .populate({
        path: 'designer',
        populate: { 
          path: 'userId'
        }
      })
    res.status(200).json({
      status: 200,
      products
    });
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async updateProduct(req, res) {
    const { files, body } = req;
    const { productId } = req.params;

    const product = await Products.findById(productId);

    Object.keys(body).forEach((key) => {
      product[key] = body[key];
    });

    const frontImage = files && files.frontImage ? files.frontImage[0].location : null;
    const backImage = files && files.backImage ? files.backImage[0].location : null;

    if (frontImage) {
      product.frontImage = frontImage;
    }
    if (frontImage) {
      product.backImage = backImage;
    }
    if (files && files.images) {
      product.images = files && files.images.map(file => file.location);
    }

    await product.save();
    res.status(200).json({ status: 200, data: product });
  }

  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async deleteOneProduct(req, res) {
    const { productId } = req.params;
    const products = await Products.findById(productId);
    await products.remove();
    return res.status(200).json({
      status: 200,
      error: 'products removed'
    });
  }
}


export default ProductsController;
