/* **************************************************************************
 * Copyright(C) Mega Trade Website, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Abdeen Mohamed < abdeen.mohamed@outlook.com>, September 2019
 ************************************************************************** */

import fs from 'fs'
import { hash, compare } from 'bcrypt'

import Admin from './Model'
import Users from '../users/Model'
import Constants from '../../config/Constants'
import Subscriptions from '../subscriptions/Model'
import UserDashboard from '../userDashboard/Model'

export const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    const newPassword = await hash(password, 9)

    try {
        const admin = await Admin.findOne({ email })
        if (admin) {
            return res.json({
                error: true,
                message: 'An account is already registered with this email, please use a different email or sign in'
            })
        }

        return res.json({
            error: false,
            message: 'A new account has been created for you successfully',
            data: await Admin.create({ firstName, lastName, email, password: newPassword })
        })
    } catch (error) {
        return res.json({
            error: true,
            message: 'Something went wrong while signing you in, please try again'
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const admin = await Admin.findOne({ email })
        if (!admin) {
            return res.json({
                error: true,
                message: 'The email you entered does not seem to be registered, please check if you entered it correct'
            })
        }

        await compare(password, admin.password, (error, doesMatch) => {
            if (doesMatch)
                return res.json({
                    error: false,
                    message: 'Logged in to your account successfully',
                    data: admin
                })
            else
                return res.json({
                    error: true,
                    message: 'Wrong password, please try again'
                })
        })
    } catch (error) {
        return res.json({
            error: true,
            message: 'Something went wrong while signing you in, please try again'
        })
    }
}

export const fetchAccount = async (req, res) => {
    const { adminId } = req.body

    try {
        const admin = await Admin.findById(adminId)
        if (!admin) {
            return res.json({
                error: true,
                message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
            })
        }

        return res.json({
            error: false,
            data: admin
        })
    } catch (error) {
        return res.json({
            error: true,
            message: 'Something went wrong while getting your profile, please refresh the page'
        })
    }
}

export const updateAccount = async (req, res) => {
    const { adminId, email, avatar, lastName, password, firstName, city, number, country } = req.body

    try {
        const admin = await Admin.findById(adminId)

        if (!admin) {
            return res.json({
                error: true,
                message: 'Error updating. Your account is not found, either deactivated or deleted'
            })
        }

        if (city !== undefined)
            await Admin.findByIdAndUpdate(adminId, { city })

        if (email !== undefined)
            await Admin.findByIdAndUpdate(adminId, { email })

        if (number !== undefined)
            await Admin.findByIdAndUpdate(adminId, { number })

        if (country !== undefined)
            await Admin.findByIdAndUpdate(adminId, { country })

        if (lastName !== undefined)
            await Admin.findByIdAndUpdate(adminId, { lastName })

        if (firstName !== undefined)
            await Admin.findByIdAndUpdate(adminId, { firstName })

        if (avatar !== undefined) {
            if (avatar.base64) {
                let profilePic = avatar.image
                const imageName = '/' + new Date().getTime().toString() + '.png';
                const base64Data = profilePic.replace(/^data:([A-Za-z-+/]+);base64,/, '')
                const imagePath = `uploads/profile_pictures/${adminId}`

                if (!fs.existsSync(imagePath))
                    fs.mkdirSync(imagePath)

                fs.writeFile(imagePath + imageName, base64Data, 'base64', (error) => console.log(error))

                profilePic = Constants.SERVER_URL + imagePath + imageName

                await Admin.findByIdAndUpdate(adminId, { avatar: profilePic })
            }
        }

        if (password !== undefined) {
            const newPassword = await hash(password, 9)
            await Admin.findByIdAndUpdate(adminId, { password: newPassword })
        }

        return res.json({
            error: false,
            message: 'Your account details have been updated successfully'
        })
    } catch (error) {
        return res.json({
            error: true,
            message: 'Something went wrong while updating your profile, please refresh the page and try again'
        })
    }
}

export const fetchSubscriptions = async (req, res) => {
    const { adminId } = req.body

    try {
        const admin = await Admin.findById(adminId)
        if (!admin) {
            return res.json({
                error: true,
                message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
            })
        }

        const subscriptions = await Subscriptions.find({})

        return res.json({
            error: false,
            data: subscriptions
        })
    } catch (error) {
        return res.json({
            error: true,
            message: 'Something went wrong while getting the subsription packages, please refresh the page'
        })
    }
}

export const fetchUserDashboard = async (req, res) => {
    const { adminId } = req.body

    try {
        const admin = await Admin.findById(adminId)
        if (!admin) {
            return res.json({
                error: true,
                message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
            })
        }

        const userDashboard = await UserDashboard.findOne({})
        if (userDashboard)
            return res.json({
                error: false,
                data: userDashboard
            })

        return res.json({
            error: false,
            data: await UserDashboard.create({})
        })
    } catch (error) {
        return res.json({
            error: true,
            message: 'Something went wrong while getting the subsription packages, please refresh the page'
        })
    }
}

export const createUserDashboard = async (req, res) => {
    const { adminId, totalPips, totalUsers, tradeBudget, totalProfits, tradeFocus, latestAlerts } = req.body

    console.log(adminId, totalPips, totalUsers, tradeBudget, totalProfits, tradeFocus, latestAlerts);

    try {
        const admin = await Admin.findById(adminId)
        if (!admin) {
            return res.json({
                error: true,
                message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
            })
        }

        const userDashboard = await UserDashboard.findOne({})
        if (userDashboard) {
            await UserDashboard.findByIdAndUpdate(userDashboard._id, {
                totalPips,
                totalUsers,
                tradeBudget,
                totalProfits,
                tradeFocus: {
                    data: tradeFocus.data,
                    labels: tradeFocus.labels,
                    backgroundColor: tradeFocus.backgroundColor
                },
                latestAlerts: {
                    thisYear: latestAlerts.thisYear,
                    lastYear: latestAlerts.lastYear
                }
            })

            return res.json({
                error: false,
                message: 'The new user dashboard data has been updated successfully'
            })
        }

        await UserDashboard.create({})

        return res.json({
            error: false,
            message: 'The new user dashboard data has been updated successfully'
        })
    } catch (error) {
        return res.json({
            error: true,
            message: 'Something went wrong while creating the user dashboard data, please refresh the page'
        })
    }
}

export const createSubscriptions = async (req, res) => {
    const { adminId, title, validity, price, image, description } = req.body

    try {
        const admin = await Admin.findById(adminId)
        if (!admin) {
            return res.json({
                error: true,
                message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
            })
        }

        let newImage
        if (image !== undefined) {
            let subscriptionPic = image
            const imageName = '/' + new Date().getTime().toString() + '.png';
            const base64Data = subscriptionPic.replace(/^data:([A-Za-z-+/]+);base64,/, '')
            const imagePath = `uploads/subscriptions`

            if (!fs.existsSync(imagePath))
                fs.mkdirSync(imagePath)

            fs.writeFile(imagePath + imageName, base64Data, 'base64', (error) => console.log(error))

            newImage = Constants.SERVER_URL + imagePath + imageName
        }

        await Subscriptions.create({ image: newImage, price, title, validity, description })

        return res.json({
            error: false,
            message: 'A new subscription package has been created successfully'
        })
    } catch (error) {
        return res.json({
            error: true,
            message: 'Something went wrong while getting the subsription packages, please refresh the page'
        })
    }
}

export const removeSubscriptions = async (req, res) => {
    const { adminId, subscriptionId } = req.body

    try {
        const admin = await Admin.findById(adminId)
        if (!admin) {
            return res.json({
                error: true,
                message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
            })
        }

        await Subscriptions.findByIdAndDelete(subscriptionId)

        return res.json({
            error: false,
            message: 'The subscription package has been deleted successfully'
        })
    } catch (error) {
        return res.json({
            error: true,
            message: 'Something went wrong while getting the subsription packages, please refresh the page'
        })
    }
}

export const createUser = async (req, res) => {
    const { adminId } = req.body

    try {
        const admin = await Admin.findById(adminId)
        if (!admin) {
            return res.json({
                error: true,
                message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
            })
        }

        return res.json({
            error: false,
            message: 'The subscription package has been deleted successfully'
        })
    } catch (error) {
        return res.json({
            error: true,
            message: 'Something went wrong while getting the subsription packages, please refresh the page'
        })
    }
}

export const fetchUsersList = async (req, res) => {
    const { adminId } = req.body

    try {
        const admin = await Admin.findById(adminId)
        if (!admin) {
            return res.json({
                error: true,
                message: 'Error getting your account details. Your account is not found, either deactivated or deleted'
            })
        }

        return res.json({
            error: false,
            data: await Users.find({})
        })
    } catch (error) {
        return res.json({
            error: true,
            message: 'Something went wrong while getting the subsription packages, please refresh the page'
        })
    }
}