const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints

router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/account', async (req, res) => {
    const tableContent = await appService.fetchAccountFromDb();
    res.json({data: tableContent});
});

router.get('/influencer', async (req, res) => {
    const tableContent = await appService.fetchInfluencerFromDb();
    res.json({data: tableContent});
});

router.get('/brandDeal', async (req, res) => {
    const tableContent = await appService.fetchBrandDealFromDb();
    res.json({data: tableContent});
})

router.get('/company', async (req, res) => {
    const tableContent = await appService.fetchCompanyFromDb();
    res.json({data: tableContent});
})

router.get('/post', async (req, res) => {
    const tableContent = await appService.fetchPostFromDb();
    res.json({data: tableContent});
})

router.delete('/delete-influencer/:id', async (req, res) => {
    const deleteResult = await appService.deleteInfluencer(req.params.id);
    res.json(deleteResult);
});

// router.post("/initiate-demotable", async (req, res) => {
//     const initiateResult = await appService.initiateDemotable();
//     if (initiateResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

router.post("/insert-account", async (req, res) => {
    const {username, platform, influencer, followers, date} = req.body;
    const insertResult = await appService.insertAccount(
        username, platform, influencer, followers, date
    );
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// router.post("/update-name-demotable", async (req, res) => {
//     const { oldName, newName } = req.body;
//     const updateResult = await appService.updateNameDemotable(oldName, newName);
//     if (updateResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

// router.get('/count-demotable', async (req, res) => {
//     const tableCount = await appService.countDemotable();
//     if (tableCount >= 0) {
//         res.json({ 
//             success: true,  
//             count: tableCount
//         });
//     } else {
//         res.status(500).json({ 
//             success: false, 
//             count: tableCount
//         });
//     }
// });


module.exports = router;