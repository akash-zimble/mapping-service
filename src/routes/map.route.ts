import express, { Router, Request, Response } from 'express';
import { ApiRequest } from '../interfaces/api-request';
import { Mapper } from '../mapper';
import { getMappingConfig, getTranslatorConfig } from '../config/storage';

const router: Router = express.Router();

router.post('/map', (req: Request<{}, {}, ApiRequest>, res: Response) => {
  try {
    const { data, mapId, translatorIds }: ApiRequest = req.body;
    if (!data || !mapId || !translatorIds) {
      return res.status(400).json({ error: 'Invalid input: missing required fields (data, mapId, translatorIds)' });
    }

    const mappingConfig = getMappingConfig(mapId);
    const translator = getTranslatorConfig(translatorIds);

    const mapper = new Mapper();
    const output = mapper.map({ data, mappingConfig, translator });
    res.status(200).json(output);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;