import loginRegisterService from '../service/loginRegisterService';

// const testApi = (req, res) => {
//     return res.status(200).json({
//         message: 'oke',
//         data: 'test api',
//     });
// };

const handleRegister = async (req, res) => {
    try {
        //req.body: email, phone, password
        if (!req.body.email || !req.body.password) {
            return res.status(200).json({
                message: 'Missing required parameters', // error message
                data: '', // data
            });
        }
        if (req.body.password && req.body.password.length < 4) {
            return res.status(200).json({
                message: 'Your password must have more than 3 letters', // error message
                data: '', // data
            });
        }

        //service: create user
        let data = await loginRegisterService.registerNewUser(req.body);

        return res.status(200).json({
            message: data.EM, // error message
            data: data.DT, // data
        });
    } catch (e) {
        return res.status(500).json({
            message: 'error from server', // error message
            data: '', // data
        });
    }
};

const handleLogin = async (req, res) => {
    try {
        let data = await loginRegisterService.handleUserLogin(req.body);
        //set cookie
        // if (data && data.DT && data.DT.access_token) {
        //     res.cookie('jwt', data.DT.access_token, {
        //         httpOnly: true,
        //         maxAge: 60 * 60 * 1000,
        //     });
        // }

        return res.status(200).json({
            message: data.EM, // error message
            data: data.DT, // data
        });
    } catch (error) {
        return res.status(500).json({
            message: 'error from server', // error message
            data: '', // data
        });
    }
};

const handleRefreshToken = async (req, res) => {
    try {
        let data = await loginRegisterService.handleRefreshToken(req.body);

        return res.status(200).json({
            message: data.EM, // error message
            data: data.DT, // data
        });
    } catch (error) {
        return res.status(500).json({
            message: 'error from server', // error message
            data: '', // data
        });
    }
};

const handleLoginBySocial = async (req, res) => {
    try {
        let data = await loginRegisterService.handleLoginBySocial(req.body);

        return res.status(200).json({
            message: data.EM, // error message
            data: data.DT, // data
        });
    } catch (error) {
        return res.status(500).json({
            message: 'error from server', // error message
            data: '', // data
        });
    }
};

const handleForgotPass = async (req, res) => {
    try {
        let data = await loginRegisterService.handleForgotPass(req.body);

        return res.status(200).json({
            message: data.EM, // error message
            data: data.DT, // data
        });
    } catch (error) {
        return res.status(500).json({
            message: 'error from server', // error message
            data: '', // data
        });
    }
};

const handleResetPass = async (req, res) => {
    try {
        console.log('params: ', req.params);
        const { id, token } = req.params;
        const { password } = req.body;
        let data = await loginRegisterService.handleResetPass(id, token, password);
        console.log('🚀 ~ handleResetPass ~ data:', data);

        return res.status(200).json({
            message: data.EM, // error message
            data: data.DT, // data
        });
    } catch (error) {
        return res.status(500).json({
            message: 'error from server', // error message
            data: '', // data
        });
    }
};

module.exports = {
    handleRegister,
    handleLogin,
    handleLoginBySocial,
    handleRefreshToken,
    handleForgotPass,
    handleResetPass,
};
