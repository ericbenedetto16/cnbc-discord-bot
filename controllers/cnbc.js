const BreakingNews = require('../models/BreakingNews');

exports.articleExistsCNBC = async a => {
    try {
        const article = await BreakingNews.findOne({ url: a });
        if (!article) {
            return false;
        }
        return true;
    } catch (err) {
        console.log(err);
        return true;
    }
}

exports.addArticle = async a => {
    try {
        await BreakingNews.create(a);

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}