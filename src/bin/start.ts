#!/usr/bin/env node
import { start } from '../lib/index';
start();
process.on('disconnect', () => process.exit());
