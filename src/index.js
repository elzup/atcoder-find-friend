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
	const { name, url, rank } = res.options;
	const $ = res.$
	const twitter = $($('.dl-horizontal dd:nth-of-type(2)')[0]).text()
	const at = $($('.dl-horizontal dd:last-child')[0]).text()
	console.log({name, at, twitter , url, rank});
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

	const $ = res.$
	const trs = _.filter(
		res.$('table tbody tr'),
		v => $(v).find('img').attr('src') === '/public/img/flag/JP.png',
	)
	_.each(trs, (v) => {
		const tr = $(v)
		const userLink = tr.find('a').attr('href')
		const url = `${HOST}${userLink}`
		const rank = parseInt($(tr.find('td:nth-of-type(1)')).text())
		const name = $(tr.find('.username')).text()
		userPageCrawler.queue([{ url, rank, name }])
	})
	done();
};

const c = new Crawler({
	maxConnections: 1,
	callback: scrape,
	rateLimit: 1000
});

const urls = _.map(_.range(1, 73), i => ({
	url: `${HOST}/ranking?p=${i}`
}));

c.queue(urls);
