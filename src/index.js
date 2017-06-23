// @flow

import Crawler from 'crawler';
import _ from 'lodash';

const HOST = 'https://atcoder.jp'

const scrapeUserPage = (error, res, done) => {
	if (error) {
		console.log(error);
		done();
		return;
	}
	if (res.statusCode === 404) {
		console.log(`404: ${res.options.url}`);
		done();
		return;
	}
	const { url, rank } = res.options;
	const $ = res.$
	const text = $($('.dl-horizontal dd:last-child')[0]).text()
	console.log(url);
	console.log(text);
	console.log(rank);
	done()
};


const userPageCrawler = new Crawler({
	maxConnections: 1,
	callback: scrapeUserPage,
	rateLimit: 1
});

const scrape = (error, res, done) => {
	if (error) {
		console.log(error);
		done();
		return;
	}
	if (res.statusCode === 404) {
		console.log(`404: ${res.options.url}`);
		done();
		return;
	}

	const trs = _.filter(
		res.$('table tbody tr'),
		v => res.$(v).find('img').attr('src') === '/public/img/flag/JP.png',
	)
	_.each(trs, (v) => {
		const userLink = res.$(v).find('a').attr('href')
		const url = `${HOST}${userLink}`
		const rank = 123
		userPageCrawler.queue([{ url, rank}])
	})
	done();
};

const c = new Crawler({
	maxConnections: 1,
	callback: scrape,
	rateLimit: 1000
});

const urls = _.map(_.range(1, 2), i => ({
	url: `${HOST}/ranking?p=${i}`
}));

c.queue(urls);
