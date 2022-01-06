#!/usr/bin/env node
import { main } from './main'
import { cfg } from './config';

main(cfg.get('path'), cfg.get('lang1'), cfg.get('lang2'));