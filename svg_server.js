var webdriver = require('selenium-webdriver'),
By = require('selenium-webdriver').By,
until = require('selenium-webdriver').until;
var http = require('http');
var url = require('url');


function run_server(port, regexperAddr) {

    // Start by creating a Firefox browser that can route our requests to Regexper
    // You will probably want to make this browser 'headless' if your server has no display
    // Browser shuts down when this script is interrupted
    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();

    // Call the Regexper server for an SVG
    function fetchSvg (pattern, callback) {
        driver.get(regexperAddr + '#' + pattern);
        driver.wait(until.elementLocated(By.id('regexp-render')))
            .then(function (element) {
                element.getOuterHtml().then(function (html) {
                    callback(null, html);
                });
        });
    }

    // Build a server that listens for requests and forwards them to Regexper
    var server = http.createServer(function (req, resp) {
    var urlinfo = url.parse(req.url, true);
    var pattern = urlinfo.query.pattern;
    fetchSvg(pattern, function (err, svg) {
        if (err) {
            console.error(err);
        }
        resp.writeHead(200, {'Content-Type': 'plain/text'});
            resp.end(svg + '\n');
        });
    });
    server.listen(port);

}


module.exports = {
    start: run_server
};
