BEGIN;

WITH reactivated AS (
  UPDATE lots
  SET status = 'live',
      closed_at = NULL,
      winner_user_id = NULL,
      ends_at = NULL
  WHERE status IN ('live', 'scheduled', 'closed')
  RETURNING id, category_id
)
DELETE FROM orders
WHERE status = 'pending'
  AND lot_id IN (SELECT id FROM reactivated);

UPDATE categories AS c
SET active_lots = COALESCE(stats.total_live, 0)
FROM (
  SELECT category_id, COUNT(*)::int AS total_live
  FROM lots
  WHERE status = 'live'
    AND category_id IS NOT NULL
  GROUP BY category_id
) AS stats
WHERE c.id = stats.category_id;

UPDATE categories
SET active_lots = 0
WHERE id NOT IN (
  SELECT DISTINCT category_id
  FROM lots
  WHERE status = 'live'
    AND category_id IS NOT NULL
);

COMMIT;

SELECT status, COUNT(*)
FROM lots
GROUP BY status
ORDER BY status;
