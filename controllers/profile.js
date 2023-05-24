import { Types } from 'mongoose';
import Profile from '../models/Profile';

/**
 * @exports
 * @class
 */
class ProfileController {
  /**
   *
   * @param {Object} req Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  async createOrUpdateProfile(req, res) {
    const {
      company, bio, cardNumber, expiryDate, cvv,
      telephone, country, city, street, houseNumber, zipcode,
      landmark, googleMapLink,
      billingAddress,
    } = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.company = company;
    profileFields.bio = bio;
    profileFields.country = country;
    profileFields.city = city;
    profileFields.street = street;
    profileFields.houseNumber = houseNumber;
    profileFields.zipcode = zipcode;
    profileFields.landmark = landmark;
    profileFields.billingAddress = billingAddress;
    profileFields.googleMapLink = googleMapLink;
    profileFields.paymentInfo = {};
    profileFields.paymentInfo.cardNumber = cardNumber;
    profileFields.paymentInfo.telephone = telephone;
    profileFields.paymentInfo.expiryDate = expiryDate;
    profileFields.paymentInfo.cvv = cvv;

    let profile = await Profile.findOne({ user: Types.ObjectId(req.user.id) });
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        {
          user: req.user.id
        },
        { $set: profileFields },
        { new: true }
      );
      return res.status(200).json({ status: 200, profile });
    }
    profile = new Profile(profileFields);
    await profile.save();
    return res.status(201).json({ status: 201, profile });
  }

  /**
 *
 * @param {Object} req Request from client
 * @param {Object} res Response to the client
 * @returns {Object} Response
 */
  async currentUserProfile(req, res) {
    let profile = await Profile.findOne({
      user: new Types.ObjectId(req.user.id)
    }).populate('user', '-password');

    if (!profile) {
      profile = new Profile({ user: req.user.id });
      await profile.save();
      profile = await Profile.findOne({
        user: new Types.ObjectId(req.user.id)
      }).populate('user', '-password');
    }

    return res.status(200).json({ status: 200, profile, });
  }
}

export default ProfileController;
