// for https://awschatbot.devpost.com/

// using https://aws.amazon.com/blogs/aws/new-slack-integration-blueprints-for-aws-lambda/

// "I find your slack-jawed stare very attractive Philip J. Fry."
// https://morbotron.com/caption/S03E11/446044

// "I'll always remember you, Fry. Memory deleted."
// https://morbotron.com/caption/S03E11/1277542

// GET https://morbotron.com/api/search?q=good%20news%20everyone HTTP/1.1
// [{"Id":2100806,"Episode":"S05E10","Timestamp":83182},{"Id":2434483,"Episode":"S08E10","Timestamp":33700},{"Id":2017055,"Episode":"S05E02","Timestamp":422789},{"Id":1887280,"Episode":"S03E15","Timestamp":176408},{"Id":2017056,"Episode":"S05E02","Timestamp":422989},{"Id":1887276,"Episode":"S03E15","Timestamp":175574},{"Id":1899136,"Episode":"S02E13","Timestamp":43592},{"Id":2470050,"Episode":"S10E03","Timestamp":120037},{"Id":1869701,"Episode":"S02E10","Timestamp":634934},{"Id":2071423,"Episode":"S06E01","Timestamp":95220},{"Id":2198965,"Episode":"S07E01","Timestamp":691315},{"Id":2014966,"Episode":"S04E10","Timestamp":33667},{"Id":2180886,"Episode":"S06E03","Timestamp":1898478},{"Id":2173590,"Episode":"S05E15","Timestamp":840156},{"Id":2180915,"Episode":"S06E03","Timestamp":1901189},{"Id":1736727,"Episode":"S01E07","Timestamp":330736},{"Id":1907743,"Episode":"S02E14","Timestamp":34083},{"Id":2359377,"Episode":"S09E09","Timestamp":481022},{"Id":1919501,"Episode":"S02E14","Timestamp":1251244},{"Id":1919480,"Episode":"S02E14","Timestamp":1249075},{"Id":2324187,"Episode":"S07E12","Timestamp":21896},{"Id":2374774,"Episode":"S08E03","Timestamp":336294},{"Id":2073843,"Episode":"S06E01","Timestamp":415541},{"Id":2374769,"Episode":"S08E03","Timestamp":336086},{"Id":1869699,"Episode":"S02E10","Timestamp":634517},{"Id":2483396,"Episode":"S10E05","Timestamp":476851},{"Id":1769402,"Episode":"S01E09","Timestamp":367477},{"Id":1990322,"Episode":"S04E08","Timestamp":81530},{"Id":2324188,"Episode":"S07E12","Timestamp":21479},{"Id":2001932,"Episode":"S05E01","Timestamp":217567},{"Id":2017046,"Episode":"S05E02","Timestamp":422155},{"Id":1887275,"Episode":"S03E15","Timestamp":174540},{"Id":1919500,"Episode":"S02E14","Timestamp":1250577},{"Id":2434475,"Episode":"S08E10","Timestamp":32032},{"Id":1778784,"Episode":"S03E07","Timestamp":62845},{"Id":2483391,"Episode":"S10E05","Timestamp":476017}]

// GET https://morbotron.com/api/caption?e=S05E10&t=83182 HTTP/1.1
// {"Episode":{"Id":322,"Key":"S05E10","Season":5,"EpisodeNumber":10,"Title":"The Farnsworth Parabox","Director":"Ron Hughart","Writer":"Bill Odenkirk","OriginalAirDate":"8-Jun-03","WikiLink":"https://en.wikipedia.org/wiki/The_Farnsworth_Parabox"},"Frame":{"Id":2100806,"Episode":"S05E10","Timestamp":83182},"Subtitles":[{"Id":160916,"RepresentativeTimestamp":80963,"Episode":"S05E10","StartTimestamp":80121,"EndTimestamp":82207,"Content":"So, will you go out with me?","Language":"en"},{"Id":160917,"RepresentativeTimestamp":82765,"Episode":"S05E10","StartTimestamp":82249,"EndTimestamp":84001,"Content":"Good news, everyone.","Language":"en"},{"Id":160918,"RepresentativeTimestamp":85501,"Episode":"S05E10","StartTimestamp":84043,"EndTimestamp":86837,"Content":"I'm still technically alive. Yes.","Language":"en"}],"Nearby":[{"Id":2100800,"Episode":"S05E10","Timestamp":82348},{"Id":2100802,"Episode":"S05E10","Timestamp":82565},{"Id":2100803,"Episode":"S05E10","Timestamp":82765},{"Id":2100806,"Episode":"S05E10","Timestamp":83182},{"Id":2100808,"Episode":"S05E10","Timestamp":83399},{"Id":2100807,"Episode":"S05E10","Timestamp":83599},{"Id":2100815,"Episode":"S05E10","Timestamp":83816}]}

// GET https://morbotron.com/meme/S05E10/83182.jpg?b64lines=IFNvLCB3aWxsIHlvdSBnbyBvdXQgd2l0aAogbWU_IEdvb2QgbmV3cywgZXZlcnlvbmUuCiBJJ20gc3RpbGwgdGVjaG5pY2FsbHkKIGFsaXZlLiBZZXMu HTTP/1.1
// b64lines is base64 meme text but with `/` replaced with `_`
// returns image.jpeg

// pseudo-code follows:

var rp = require('request-promise');
var qs = require('qs');

const kmsEncryptedToken = 'AQECAHiEnAZqKr1pw8f8cxQuJ6eUTg1t8er4Bv88iQgCuVCXKAAAAHYwdAYJKoZIhvcNAQcGoGcwZQIBADBgBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDKJn5+gIatDQ69w0ZgIBEIAzGjb/qCbiNL/avu0TGDgQJ88yfR+ToAZjToJueVTMVGegUANNQ/5DK9DHWiBFkmk0qYOD';

// accept slack command `/morbotron go <search text>`
// later `go` could be augmented with other commands for previewing or customising results

function getMemeImageUrl(searchText) {

    var promise = rp({ url: 'https://morbotron.com/api/search', qs: { q: searchText }, json: true })
        .then((json) => {
            if (json.length && json[0].Episode && json[0].Timestamp) {
                this.episode = json[0].Episode;
                this.timestamp = json[0].Timestamp;
                return rp({ url: 'https://morbotron.com/api/caption', qs: {
                    e: this.episode,
                    t: this.timestamp,
                }, json: true });
            } else {
                throw new Error('No search results');
            }
        })
        .then((json) => {
            if (json.Subtitles && json.Subtitles.length) {
                var lines = json.Subtitles.sort(sub => sub.RepresentativeTimestamp)
                    .map(sub => sub.Content)
                    .join('\n');

                var encoded = new Buffer(lines).toString('base64')
                    .replace(/\+/g, '-').replace(/\//g, '_');

                var url = `https://morbotron.com/meme/${this.episode}/${this.timestamp}.jpg`;
                var querystring = qs.stringify({ b64lines: encoded })
                return `${url}?${querystring}`;
            } else {
                throw new Error('No subtitles for search result');
            }
        });
    return promise;
}

getMemeImageUrl("I'm a delivery boy")
    .then((url) => console.log(url))
    .catch((err) => {
        console.error(err);
    });
