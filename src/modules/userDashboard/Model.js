import mongoose, { Schema } from 'mongoose'

const UserDashboardSchema = new Schema(
    {
        totalPips: {
            type: String,
            default: '9,769'
        },
        totalUsers: {
            type: String,
            default: '793'
        },
        tradeBudget: {
            type: String,
            default: '4,519'
        },
        totalProfits: {
            type: String,
            default: '23,940'
        },
        tradeFocus: {
            labels: {
                type: Array,
                default: ['USD/JPY', 'EUR/JPY', 'Wall Street DJI']
            },
            data: {
                type: Array,
                default: ['63', '15', '22']
            },
            backgroundColor: {
                type: Array,
                default: ['blue', 'red', 'orange']
            }
        },
        latestAlerts: {
            thisYear: {
                type: Array,
                default: ['18', '5', '19', '27', '29', '19', '20']
            },
            lastYear: {
                type: Array,
                default: ['11', '20', '12', '29', '30', '25', '13']
            }
        }
    }
)

export default mongoose.model('userDashboard', UserDashboardSchema)
