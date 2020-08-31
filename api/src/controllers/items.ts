import express from 'express';
import redis from 'redis';
import asyncHandler from 'express-async-handler';
import ItemsService from '../services/items';
import checkCacheMiddleware from '../middleware/check-cache';
import setCacheMiddleware from '../middleware/set-cache';
import delCacheMiddleware from '../middleware/delete-cache';
import sanitizeQuery from '../middleware/sanitize-query';
import collectionExists from '../middleware/collection-exists';
import MetaService from '../services/meta';
import { RouteNotFoundException } from '../exceptions';

const router = express.Router();

router.post(
	'/:collection',
	collectionExists,
	sanitizeQuery,
	delCacheMiddleware,
	asyncHandler(async (req, res) => {
		if (req.singleton) {
			throw new RouteNotFoundException(req.path);
		}

		const service = new ItemsService(req.collection, { accountability: req.accountability });
		const primaryKey = await service.create(req.body);
		const result = await service.readByKey(primaryKey, req.sanitizedQuery);

		res.json({ data: result || null });
	})
);

router.get(
	'/:collection',
	collectionExists,
	sanitizeQuery,
	checkCacheMiddleware,
	asyncHandler(async (req, res) => {
		const service = new ItemsService(req.collection, { accountability: req.accountability });
		const metaService = new MetaService({ accountability: req.accountability });

		const records = req.singleton
			? await service.readSingleton(req.sanitizedQuery)
			: await service.readByQuery(req.sanitizedQuery);

		const meta = await metaService.getMetaForQuery(req.collection, req.sanitizedQuery);

		return res.json({
			meta: meta,
			data: records || null,
		});
	}),
	setCacheMiddleware
);

router.get(
	'/:collection/:pk',
	collectionExists,
	sanitizeQuery,
	checkCacheMiddleware,
	asyncHandler(async (req, res) => {
		if (req.singleton) {
			throw new RouteNotFoundException(req.path);
		}

		const service = new ItemsService(req.collection, { accountability: req.accountability });
		const primaryKey = req.params.pk.includes(',') ? req.params.pk.split(',') : req.params.pk;
		const result = await service.readByKey(primaryKey as any, req.sanitizedQuery);

		return res.json({
			data: result || null,
		});
	}),
	setCacheMiddleware
);

router.patch(
	'/:collection',
	collectionExists,
	sanitizeQuery,
	delCacheMiddleware,
	asyncHandler(async (req, res) => {
		const service = new ItemsService(req.collection, { accountability: req.accountability });

		if (req.singleton === true) {
			await service.upsertSingleton(req.body);
			const item = await service.readSingleton(req.sanitizedQuery);

			return res.json({ data: item || null });
		}

		const primaryKeys = await service.update(req.body);
		const result = await service.readByKey(primaryKeys, req.sanitizedQuery);
		return res.json({ data: result || null });
	})
);

router.patch(
	'/:collection/:pk',
	collectionExists,
	sanitizeQuery,
	delCacheMiddleware,
	asyncHandler(async (req, res) => {
		if (req.singleton) {
			throw new RouteNotFoundException(req.path);
		}

		const service = new ItemsService(req.collection, { accountability: req.accountability });
		const primaryKey = req.params.pk.includes(',') ? req.params.pk.split(',') : req.params.pk;

		const updatedPrimaryKey = await service.update(req.body, primaryKey as any);
		const result = await service.readByKey(updatedPrimaryKey, req.sanitizedQuery);

		res.json({ data: result || null });
	})
);

router.delete(
	'/:collection/:pk',
	collectionExists,
	delCacheMiddleware,
	asyncHandler(async (req, res) => {
		const service = new ItemsService(req.collection, { accountability: req.accountability });
		const pk = req.params.pk.includes(',') ? req.params.pk.split(',') : req.params.pk;
		await service.delete(pk as any);

		return res.status(200).end();
	})
);

export default router;
