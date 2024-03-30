const { logError } = require("../../helpers/logger")

const clientDashboardData = async(req, res) =>{
    try {
        res.status(200).json({})
    } catch (error) {
        logError('clientDashboardData error:', error);
        res.status(500).json({ error: 'Failed to get client dashboard data' });
    }
}

const serviceProviderDashboardData = async(req, res) =>{
    try {
        res.status(200).json({})
    } catch (error) {
        logError('serviceProviderDashboardData error:', error);
        res.status(500).json({ error: 'Failed to get serviceProvider dashboard data' });
    }
}

const clientVideosHistory = async(req, res) =>{
    try {
        res.status(200).json({})
    } catch (error) {
        logError('clientVideosHistory error:', error);
        res.status(500).json({ error: 'Failed to get client videos history' });
    }
}

const serviceProviderVideosHistory = async(req, res) =>{
    try {
        res.status(200).json({})
    } catch (error) {
        logError('serviceProviderVideosHistory error:', error);
        res.status(500).json({ error: 'Failed to get serviceProvider videos history' });
    }
}


module.exports = {
    clientDashboardData,
    serviceProviderDashboardData,
    clientVideosHistory,
    serviceProviderVideosHistory
}