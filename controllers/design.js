/* eslint-disable require-jsdoc */
import Design from '../models/Designs';

class Designs {
  static async createDesign(req, res) {
    try {
      const {
        frontColor,
        frontSize,
        frontText,
        frontTextColor,
        frontCanvas,
        backColor,
        backSize,
        backText,
        backTextColor,
        backCanvas
      } = req.body;

      const newDesign = new Design({
        user: req.user.id,
        frontColor,
        frontSize,
        frontText,
        frontTextColor,
        frontCanvas,
        backColor,
        backSize,
        backText,
        backTextColor,
        backCanvas
      });

      const design = await newDesign.save();

      return res.status(201).json({
        message: 'successfully created design',
        design
      });
    } catch (err) {
      return res.status(500).json({
        error: 'failed to create design',
      });
    }
  }

  static async getDesigns(req, res) {
    try {
      const designs = await Design.find({ user: req.user.id });
      if (designs.length < 1) {
        return res.status(404).json({
          message: 'no designs found'
        });
      }
      return res.status(200).json({
        message: 'successfully fetched designs',
        designs
      });
    } catch (err) {
      return res.status(500).json({
        error: 'failed to get designs'
      });
    }
  }

  static async getDesign(req, res) {
    try {
      const { designId } = req.params;
      const designs = await Design.findById(designId);
      return res.status(200).json({
        message: 'successfully fetched design',
        designs
      });
    } catch (err) {
      return res.status(500).json({
        error: 'failed to get design'
      });
    }
  }

  static async updateDesign(req, res) {
    try {
      const { designId } = req.params;
      const {
        frontColor,
        frontSize,
        frontText,
        frontTextColor,
        frontCanvas,
        backColor,
        backSize,
        backText,
        backTextColor,
        backCanvas
      } = req.body;
      const design = {
        frontColor,
        frontSize,
        frontText,
        frontTextColor,
        frontCanvas,
        backColor,
        backSize,
        backText,
        backTextColor,
        backCanvas
      };
      await Design.findOneAndUpdate({ _id: designId }, design);
      res.status(200).json({ status: 200, design, message: 'successfully updated design' });
    } catch (err) {
      return res.status(500).json({
        error: 'failed to update design'
      });
    }
  }

  static async deleteDesign(req, res) {
    try {
      const { designId } = req.params;
      const design = await Design.findByIdAndDelete(designId);
      res.status(204).json({ status: 204, design, message: 'successfully deleted design' });
    } catch (err) {
      return res.status(500).json({
        error: 'failed to delete design'
      });
    }
  }
}

export default Designs;
