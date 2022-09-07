SET date_time_input_format = 'best_effort';

CREATE DATABASE IF NOT EXISTS lambda;

CREATE TABLE IF NOT EXISTS lambda.hits (
  date DateTime,
  url String,
  ua String,
  ip String)
  ENGINE = MergeTree()
  PARTITION BY toYYYYMM(date)
  ORDER BY (date, url)
  SETTINGS index_granularity = 8192;
