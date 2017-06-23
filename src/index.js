// @flow

import Crawler from 'crawler';
import Crawler from 'crawler';
import _ from 'lodash';

const HOST = 'https://atcoder.jp'

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
	const { id } = res.options;

	const trs = _.filter(
		res.$('table tbody tr'),
		v => res.$(v).find('img').attr('src') === '/public/img/flag/JP.png',
	)
	_.each(trs, (v) => {
		const userLink = res.$(v).find('a').attr('href')
		console.log(`${HOST}${userLink}`);
	})
	done();
};

const c = new Crawler({
	maxConnections: 1,
	callback: scrape,
	rateLimit: 2000
});

const urls = _.map(_.range(1, 2), i => ({
	url: `${HOST}/ranking?p=${i}`
}));

c.queue(urls);
