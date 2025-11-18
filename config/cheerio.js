const cheerio = require('cheerio')

module.exports = function extractImageLinks(html){
    const $ = cheerio.load(html)
    $.html()
    const imageLinks = []
    $('img').each((_, img)=>{
        const src = $(img).attr('src')
        if(src) imageLinks.push(src)
    }) 
    return imageLinks
}