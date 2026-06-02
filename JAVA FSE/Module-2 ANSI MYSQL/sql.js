/* ════════════════════════════════════════════════════════════════
   sql.js  –  Community Event Portal · SQL Explorer
   All 25 ANSI SQL / MySQL exercises + in-browser SQLite runner
════════════════════════════════════════════════════════════════ */

/* ── Exercise data: all 25 queries ─────────────────────────────
   Each entry has: id, title, description, sql, tags, explanation
──────────────────────────────────────────────────────────────── */
const EXERCISES = [

  /* 1 */
  {
    id: 1,
    title: "User Upcoming Events",
    description: "Show all upcoming events a user is registered for in their city, sorted by date.",
    tags: ["select", "join"],
    sql: `-- Q1: Upcoming events per user in their own city, sorted by start date
SELECT
    u.full_name,
    u.city,
    e.title          AS event_title,
    e.start_date,
    e.end_date
FROM users u
JOIN registrations r  ON r.user_id   = u.user_id
JOIN events        e  ON e.event_id  = r.event_id
WHERE e.status  = 'upcoming'
  AND e.city    = u.city
ORDER BY u.full_name, e.start_date;`,
    explanation: `<strong>JOIN chain:</strong> links users → registrations → events.
The <strong>WHERE</strong> clause filters only 'upcoming' events AND enforces the city match between the user's city and the event's city.
<strong>ORDER BY</strong> gives each user's events in chronological order.`
  },

  /* 2 */
  {
    id: 2,
    title: "Top Rated Events",
    description: "Events with the highest average rating — only those with at least 10 feedback submissions.",
    tags: ["aggregate", "select"],
    sql: `-- Q2: Top rated events (minimum 10 feedback submissions)
SELECT
    e.event_id,
    e.title,
    COUNT(f.feedback_id)       AS total_feedback,
    ROUND(AVG(f.rating), 2)   AS avg_rating
FROM events   e
JOIN feedback f ON f.event_id = e.event_id
GROUP BY e.event_id, e.title
HAVING COUNT(f.feedback_id) >= 10
ORDER BY avg_rating DESC;`,
    explanation: `<strong>AVG()</strong> computes the mean rating per event.
<strong>HAVING</strong> (not WHERE) filters groups — it runs after GROUP BY and can reference aggregate results. The threshold of ≥ 10 ensures statistical significance.`
  },

  /* 3 */
  {
    id: 3,
    title: "Inactive Users",
    description: "Users who have not registered for any event in the last 90 days.",
    tags: ["subquery", "select"],
    sql: `-- Q3: Users with no registrations in the past 90 days
SELECT
    u.user_id,
    u.full_name,
    u.email,
    u.city,
    MAX(r.registration_date) AS last_registration
FROM users u
LEFT JOIN registrations r ON r.user_id = u.user_id
GROUP BY u.user_id, u.full_name, u.email, u.city
HAVING last_registration IS NULL
    OR last_registration < DATE_SUB(CURDATE(), INTERVAL 90 DAY)
ORDER BY last_registration ASC;`,
    explanation: `<strong>LEFT JOIN</strong> keeps users even if they have zero registrations.
<strong>MAX(registration_date)</strong> finds the most recent registration per user.
<strong>HAVING</strong> then checks whether that date is either NULL (never registered) or more than 90 days old using <strong>DATE_SUB + CURDATE()</strong>.`
  },

  /* 4 */
  {
    id: 4,
    title: "Peak Session Hours",
    description: "Count sessions scheduled between 10 AM and 12 PM for each event.",
    tags: ["aggregate", "select"],
    sql: `-- Q4: Sessions in the 10:00–12:00 window per event
SELECT
    e.event_id,
    e.title                     AS event_title,
    COUNT(s.session_id)         AS peak_session_count
FROM events   e
LEFT JOIN sessions s
       ON  s.event_id   = e.event_id
       AND TIME(s.start_time) >= '10:00:00'
       AND TIME(s.start_time) <  '12:00:00'
GROUP BY e.event_id, e.title
ORDER BY peak_session_count DESC;`,
    explanation: `<strong>TIME()</strong> extracts just the time portion of a DATETIME, allowing a clean window comparison.
The time filter is placed in the <strong>JOIN condition</strong> (not WHERE) so events with zero peak sessions still appear with a count of 0.`
  },

  /* 5 */
  {
    id: 5,
    title: "Most Active Cities",
    description: "Top 5 cities with the highest number of distinct user registrations.",
    tags: ["aggregate", "select"],
    sql: `-- Q5: Top 5 cities by distinct registered users
SELECT
    u.city,
    COUNT(DISTINCT r.user_id) AS distinct_registrations
FROM users        u
JOIN registrations r ON r.user_id = u.user_id
GROUP BY u.city
ORDER BY distinct_registrations DESC
LIMIT 5;`,
    explanation: `<strong>COUNT(DISTINCT r.user_id)</strong> counts unique users rather than total registration rows — a user who registers for multiple events still counts once per city.
<strong>LIMIT 5</strong> returns only the top five results after sorting.`
  },

  /* 6 */
  {
    id: 6,
    title: "Event Resource Summary",
    description: "Number of PDFs, images, and links uploaded for each event.",
    tags: ["aggregate", "select"],
    sql: `-- Q6: Resource breakdown (pdf / image / link) per event
SELECT
    e.event_id,
    e.title,
    COUNT(r.resource_id)                                   AS total_resources,
    SUM(r.resource_type = 'pdf')                          AS pdfs,
    SUM(r.resource_type = 'image')                        AS images,
    SUM(r.resource_type = 'link')                         AS links
FROM events    e
LEFT JOIN resources r ON r.event_id = e.event_id
GROUP BY e.event_id, e.title
ORDER BY total_resources DESC;`,
    explanation: `<strong>SUM(condition)</strong> is an idiomatic MySQL trick: the boolean expression evaluates to 1 or 0, so summing it counts occurrences.
<strong>LEFT JOIN</strong> ensures events with no resources still appear (with zeros).`
  },

  /* 7 */
  {
    id: 7,
    title: "Low Feedback Alerts",
    description: "Users who gave a rating less than 3, with their comments and the event name.",
    tags: ["select", "join"],
    sql: `-- Q7: Low ratings (< 3) with user and event context
SELECT
    u.full_name,
    u.email,
    e.title      AS event_title,
    f.rating,
    f.comments,
    f.feedback_date
FROM feedback f
JOIN users  u ON u.user_id  = f.user_id
JOIN events e ON e.event_id = f.event_id
WHERE f.rating < 3
ORDER BY f.rating ASC, f.feedback_date DESC;`,
    explanation: `A straightforward <strong>two-JOIN</strong> query enriching the feedback table with user and event names.
<strong>WHERE f.rating < 3</strong> isolates negative feedback.
Sorting by rating ascending surfaces the worst scores first.`
  },

  /* 8 */
  {
    id: 8,
    title: "Sessions per Upcoming Event",
    description: "All upcoming events with a count of sessions scheduled for each.",
    tags: ["aggregate", "select", "join"],
    sql: `-- Q8: Upcoming events and their session counts
SELECT
    e.event_id,
    e.title,
    e.city,
    e.start_date,
    COUNT(s.session_id) AS session_count
FROM events   e
LEFT JOIN sessions s ON s.event_id = e.event_id
WHERE e.status = 'upcoming'
GROUP BY e.event_id, e.title, e.city, e.start_date
ORDER BY e.start_date;`,
    explanation: `<strong>LEFT JOIN</strong> includes upcoming events that have no sessions yet (session_count = 0).
Only <strong>'upcoming'</strong> events are included via WHERE before grouping.`
  },

  /* 9 */
  {
    id: 9,
    title: "Organizer Event Summary",
    description: "For each organizer: number of events created and their statuses.",
    tags: ["aggregate", "select", "join"],
    sql: `-- Q9: Organizer-level event summary with status breakdown
SELECT
    u.user_id,
    u.full_name                                     AS organizer_name,
    COUNT(e.event_id)                               AS total_events,
    SUM(e.status = 'upcoming')                     AS upcoming,
    SUM(e.status = 'completed')                    AS completed,
    SUM(e.status = 'cancelled')                    AS cancelled
FROM users  u
JOIN events e ON e.organizer_id = u.user_id
GROUP BY u.user_id, u.full_name
ORDER BY total_events DESC;`,
    explanation: `Same <strong>SUM(boolean)</strong> pattern as Q6 for per-status counts.
<strong>JOIN</strong> (not LEFT JOIN) means only users who organised at least one event appear.`
  },

  /* 10 */
  {
    id: 10,
    title: "Feedback Gap",
    description: "Events that had registrations but received no feedback at all.",
    tags: ["subquery", "select", "join"],
    sql: `-- Q10: Events with registrations but zero feedback
SELECT
    e.event_id,
    e.title,
    e.status,
    COUNT(r.registration_id) AS total_registrations
FROM events       e
JOIN registrations r ON r.event_id = e.event_id
WHERE e.event_id NOT IN (
    SELECT DISTINCT event_id
    FROM feedback
)
GROUP BY e.event_id, e.title, e.status
ORDER BY total_registrations DESC;`,
    explanation: `<strong>NOT IN (subquery)</strong> excludes events that appear in the feedback table.
An alternative using <strong>LEFT JOIN / IS NULL</strong> on feedback would also work and is often faster on large tables.`
  },

  /* 11 */
  {
    id: 11,
    title: "Daily New User Count",
    description: "Number of new user registrations each day over the last 7 days.",
    tags: ["aggregate", "select"],
    sql: `-- Q11: Daily user sign-ups for the past 7 days
SELECT
    registration_date,
    COUNT(user_id) AS new_users
FROM users
WHERE registration_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY registration_date
ORDER BY registration_date;`,
    explanation: `<strong>DATE_SUB(CURDATE(), INTERVAL 7 DAY)</strong> computes a rolling 7-day window dynamically.
Grouping by <strong>registration_date</strong> produces one row per day including days with zero sign-ups only if a row exists — a CALENDAR join would fill in zeros for missing days.`
  },

  /* 12 */
  {
    id: 12,
    title: "Event with Maximum Sessions",
    description: "The event(s) with the highest number of scheduled sessions.",
    tags: ["subquery", "aggregate"],
    sql: `-- Q12: Event(s) with the most sessions (handles ties)
SELECT
    e.event_id,
    e.title,
    COUNT(s.session_id) AS session_count
FROM events   e
JOIN sessions s ON s.event_id = e.event_id
GROUP BY e.event_id, e.title
HAVING COUNT(s.session_id) = (
    SELECT MAX(cnt)
    FROM (
        SELECT COUNT(session_id) AS cnt
        FROM sessions
        GROUP BY event_id
    ) sub
)
ORDER BY e.title;`,
    explanation: `The <strong>correlated subquery in HAVING</strong> computes the global maximum session count from a derived table and matches only events at that maximum.
This correctly handles <strong>ties</strong> — multiple events with the same top count all appear.`
  },

  /* 13 */
  {
    id: 13,
    title: "Average Rating per City",
    description: "Average feedback rating for events held in each city.",
    tags: ["aggregate", "join"],
    sql: `-- Q13: Average feedback rating by event city
SELECT
    e.city,
    COUNT(DISTINCT e.event_id)   AS events_with_feedback,
    COUNT(f.feedback_id)         AS total_feedback,
    ROUND(AVG(f.rating), 2)     AS avg_rating
FROM events   e
JOIN feedback f ON f.event_id = e.event_id
GROUP BY e.city
ORDER BY avg_rating DESC;`,
    explanation: `Joining events → feedback links each rating to its event's city.
<strong>COUNT(DISTINCT e.event_id)</strong> shows how many distinct events contributed to the city's rating, giving context to the average.`
  },

  /* 14 */
  {
    id: 14,
    title: "Most Registered Events",
    description: "Top 3 events by total number of user registrations.",
    tags: ["aggregate", "select"],
    sql: `-- Q14: Top 3 events by registration count
SELECT
    e.event_id,
    e.title,
    e.city,
    e.status,
    COUNT(r.registration_id) AS total_registrations
FROM events       e
LEFT JOIN registrations r ON r.event_id = e.event_id
GROUP BY e.event_id, e.title, e.city, e.status
ORDER BY total_registrations DESC
LIMIT 3;`,
    explanation: `<strong>LEFT JOIN</strong> keeps events with zero registrations (they'd appear with count 0, but would never win top 3).
<strong>LIMIT 3</strong> after sorting gives the three most popular events.`
  },

  /* 15 */
  {
    id: 15,
    title: "Event Session Time Conflict",
    description: "Overlapping sessions within the same event (conflicting start/end times).",
    tags: ["join", "window"],
    sql: `-- Q15: Sessions that overlap within the same event
SELECT
    a.event_id,
    e.title         AS event_title,
    a.session_id    AS session_a_id,
    a.title         AS session_a,
    a.start_time    AS a_start,
    a.end_time      AS a_end,
    b.session_id    AS session_b_id,
    b.title         AS session_b,
    b.start_time    AS b_start,
    b.end_time      AS b_end
FROM sessions a
JOIN sessions b
  ON  a.event_id    = b.event_id        -- same event
 AND  a.session_id  < b.session_id      -- avoid duplicate pairs
 AND  a.start_time  < b.end_time        -- overlap condition (start of A before end of B)
 AND  a.end_time    > b.start_time      -- overlap condition (end of A after start of B)
JOIN events e ON e.event_id = a.event_id
ORDER BY a.event_id, a.start_time;`,
    explanation: `A <strong>self-join</strong> on sessions compares every pair.
The condition <strong>a.session_id < b.session_id</strong> prevents reporting the same conflict twice.
The <strong>overlap test</strong> (Allen's interval overlap: A.start < B.end AND A.end > B.start) is the standard O(1) way to detect time overlap.`
  },

  /* 16 */
  {
    id: 16,
    title: "Unregistered Active Users",
    description: "Users who created an account in the last 30 days but haven't registered for any event.",
    tags: ["subquery", "select"],
    sql: `-- Q16: New users (≤ 30 days) with zero event registrations
SELECT
    u.user_id,
    u.full_name,
    u.email,
    u.city,
    u.registration_date
FROM users u
WHERE u.registration_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
  AND u.user_id NOT IN (
      SELECT DISTINCT user_id
      FROM registrations
  )
ORDER BY u.registration_date DESC;`,
    explanation: `<strong>NOT IN (subquery)</strong> efficiently filters out users who appear in the registrations table.
Combined with the 30-day window in the outer WHERE, this surfaces brand-new users who haven't yet engaged with any event.`
  },

  /* 17 */
  {
    id: 17,
    title: "Multi-Session Speakers",
    description: "Speakers handling more than one session across all events.",
    tags: ["aggregate", "select"],
    sql: `-- Q17: Speakers with more than one session (across all events)
SELECT
    s.speaker_name,
    COUNT(s.session_id)              AS total_sessions,
    COUNT(DISTINCT s.event_id)       AS events_covered,
    GROUP_CONCAT(e.title ORDER BY e.start_date SEPARATOR ' | ') AS events
FROM sessions s
JOIN events   e ON e.event_id = s.event_id
GROUP BY s.speaker_name
HAVING COUNT(s.session_id) > 1
ORDER BY total_sessions DESC;`,
    explanation: `<strong>GROUP_CONCAT()</strong> aggregates multiple event titles into a readable list per speaker.
<strong>HAVING COUNT > 1</strong> restricts to speakers appearing in more than one session.
<strong>COUNT(DISTINCT event_id)</strong> shows whether a speaker spans multiple events or just delivers multiple sessions at one.`
  },

  /* 18 */
  {
    id: 18,
    title: "Resource Availability Check",
    description: "All events that have no resources uploaded.",
    tags: ["subquery", "select"],
    sql: `-- Q18: Events with no uploaded resources
SELECT
    e.event_id,
    e.title,
    e.city,
    e.status,
    e.start_date
FROM events e
WHERE e.event_id NOT IN (
    SELECT DISTINCT event_id
    FROM resources
)
ORDER BY e.start_date;`,
    explanation: `<strong>NOT IN (subquery)</strong> excludes all events that have at least one resource row.
An equivalent approach: <code>LEFT JOIN resources r ON r.event_id = e.event_id WHERE r.resource_id IS NULL</code>.`
  },

  /* 19 */
  {
    id: 19,
    title: "Completed Events with Feedback Summary",
    description: "For completed events: total registrations and average feedback rating.",
    tags: ["aggregate", "join"],
    sql: `-- Q19: Completed events — registrations + feedback summary
SELECT
    e.event_id,
    e.title,
    e.city,
    e.end_date,
    COUNT(DISTINCT r.registration_id)  AS total_registrations,
    COUNT(DISTINCT f.feedback_id)      AS total_feedback,
    ROUND(AVG(f.rating), 2)           AS avg_rating,
    ROUND(
        COUNT(DISTINCT f.feedback_id) * 100.0
        / NULLIF(COUNT(DISTINCT r.registration_id), 0),
    1)                                 AS feedback_rate_pct
FROM events       e
LEFT JOIN registrations r ON r.event_id = e.event_id
LEFT JOIN feedback      f ON f.event_id = e.event_id
WHERE e.status = 'completed'
GROUP BY e.event_id, e.title, e.city, e.end_date
ORDER BY avg_rating DESC NULLS LAST;`,
    explanation: `<strong>NULLIF(..., 0)</strong> prevents division-by-zero when computing the feedback rate.
Both JOINs are LEFT to keep completed events that received no registrations or no feedback.
<strong>feedback_rate_pct</strong> measures attendee engagement quality.`
  },

  /* 20 */
  {
    id: 20,
    title: "User Engagement Index",
    description: "For each user: events attended and feedback submissions.",
    tags: ["aggregate", "join"],
    sql: `-- Q20: Per-user engagement — events attended + feedbacks given
SELECT
    u.user_id,
    u.full_name,
    u.city,
    COUNT(DISTINCT r.event_id)  AS events_attended,
    COUNT(DISTINCT f.feedback_id) AS feedbacks_submitted,
    ROUND(
        COUNT(DISTINCT f.feedback_id) * 100.0
        / NULLIF(COUNT(DISTINCT r.event_id), 0),
    0)                           AS feedback_rate_pct
FROM users         u
LEFT JOIN registrations r ON r.user_id = u.user_id
LEFT JOIN feedback      f ON f.user_id = u.user_id
GROUP BY u.user_id, u.full_name, u.city
ORDER BY events_attended DESC, feedbacks_submitted DESC;`,
    explanation: `Two independent <strong>LEFT JOINs</strong> from users — one for registrations, one for feedback — avoid inflating counts.
<strong>COUNT(DISTINCT)</strong> is critical here: a Cartesian product between registrations and feedback rows for the same user would over-count without DISTINCT.`
  },

  /* 21 */
  {
    id: 21,
    title: "Top Feedback Providers",
    description: "Top 5 users who submitted the most feedback entries.",
    tags: ["aggregate", "select"],
    sql: `-- Q21: Top 5 most active feedback providers
SELECT
    u.user_id,
    u.full_name,
    u.email,
    COUNT(f.feedback_id)        AS total_feedback,
    ROUND(AVG(f.rating), 2)    AS avg_rating_given
FROM users    u
JOIN feedback f ON f.user_id = u.user_id
GROUP BY u.user_id, u.full_name, u.email
ORDER BY total_feedback DESC
LIMIT 5;`,
    explanation: `Simple aggregation joining users → feedback.
<strong>AVG(f.rating)</strong> alongside the count reveals whether a prolific reviewer tends to be generous or critical.`
  },

  /* 22 */
  {
    id: 22,
    title: "Duplicate Registrations Check",
    description: "Detect users registered more than once for the same event.",
    tags: ["aggregate", "window"],
    sql: `-- Q22: Duplicate (user, event) registrations
SELECT
    r.user_id,
    u.full_name,
    r.event_id,
    e.title        AS event_title,
    COUNT(*)       AS registration_count,
    MIN(r.registration_date) AS first_registration,
    MAX(r.registration_date) AS last_registration
FROM registrations r
JOIN users  u ON u.user_id  = r.user_id
JOIN events e ON e.event_id = r.event_id
GROUP BY r.user_id, u.full_name, r.event_id, e.title
HAVING COUNT(*) > 1
ORDER BY registration_count DESC;`,
    explanation: `<strong>GROUP BY (user_id, event_id)</strong> collapses all registrations for the same user+event pair.
<strong>HAVING COUNT(*) > 1</strong> surfaces only the duplicates.
MIN/MAX dates help identify when the double-registration occurred.`
  },

  /* 23 */
  {
    id: 23,
    title: "Registration Trends",
    description: "Month-wise registration count over the past 12 months.",
    tags: ["aggregate", "select"],
    sql: `-- Q23: Monthly registration trend (rolling 12 months)
SELECT
    DATE_FORMAT(registration_date, '%Y-%m') AS month,
    COUNT(registration_id)                  AS registrations
FROM registrations
WHERE registration_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(registration_date, '%Y-%m')
ORDER BY month;`,
    explanation: `<strong>DATE_FORMAT(date, '%Y-%m')</strong> formats dates as 'YYYY-MM' so GROUP BY produces one row per calendar month.
The <strong>WHERE</strong> clause restricts to the rolling last year.
In a BI tool this would feed directly into a line chart for trend analysis.`
  },

  /* 24 */
  {
    id: 24,
    title: "Average Session Duration per Event",
    description: "Average duration (in minutes) of sessions for each event.",
    tags: ["aggregate", "select"],
    sql: `-- Q24: Average session duration in minutes per event
SELECT
    e.event_id,
    e.title,
    COUNT(s.session_id)                                             AS total_sessions,
    ROUND(AVG(TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time)), 1) AS avg_duration_min,
    MIN(TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time))           AS shortest_min,
    MAX(TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time))           AS longest_min
FROM events   e
JOIN sessions s ON s.event_id = e.event_id
GROUP BY e.event_id, e.title
ORDER BY avg_duration_min DESC;`,
    explanation: `<strong>TIMESTAMPDIFF(MINUTE, start, end)</strong> computes exact minute difference between two DATETIMEs.
<strong>AVG()</strong> wraps it to get the mean session length.
MIN and MAX expose the range of session durations within the same event.`
  },

  /* 25 */
  {
    id: 25,
    title: "Events Without Sessions",
    description: "All events that currently have no sessions scheduled.",
    tags: ["subquery", "select"],
    sql: `-- Q25: Events with no sessions at all
SELECT
    e.event_id,
    e.title,
    e.city,
    e.status,
    e.start_date
FROM events e
LEFT JOIN sessions s ON s.event_id = e.event_id
WHERE s.session_id IS NULL
ORDER BY e.start_date;`,
    explanation: `Classic <strong>LEFT JOIN / IS NULL</strong> anti-join pattern.
LEFT JOIN includes all events; the WHERE on the right-side PK being NULL filters to only those with no matching session row.
Equivalent to: <code>WHERE event_id NOT IN (SELECT event_id FROM sessions)</code>.`
  },

];


/* ── Syntax highlighter ─────────────────────────────────────────
   Tokenises SQL and wraps in span classes for CSS colouring.
──────────────────────────────────────────────────────────────── */
const SQL_KEYWORDS = new Set([
  'SELECT','FROM','WHERE','JOIN','LEFT','RIGHT','INNER','OUTER','FULL','CROSS',
  'ON','AND','OR','NOT','IN','EXISTS','AS','GROUP','BY','ORDER','HAVING','LIMIT',
  'OFFSET','DISTINCT','ALL','UNION','INTERSECT','EXCEPT','WITH','RECURSIVE',
  'INSERT','INTO','VALUES','UPDATE','SET','DELETE','CREATE','TABLE','ALTER','DROP',
  'CONSTRAINT','PRIMARY','KEY','FOREIGN','REFERENCES','INDEX','UNIQUE','NULL','IS',
  'BETWEEN','LIKE','CASE','WHEN','THEN','ELSE','END','IF','NULLIF','COALESCE',
  'ASC','DESC','TRUE','FALSE','INTERVAL','DAY','MONTH','YEAR','MINUTE',
  'SEPARATOR','LAST'
]);
const SQL_FUNCTIONS = new Set([
  'COUNT','SUM','AVG','MIN','MAX','ROUND','FLOOR','CEIL','ABS',
  'CONCAT','GROUP_CONCAT','SUBSTR','SUBSTRING','LENGTH','LOWER','UPPER','TRIM',
  'DATE_FORMAT','DATE_SUB','DATE_ADD','CURDATE','NOW','TIMESTAMPDIFF',
  'DATEDIFF','TIME','YEAR','MONTH','DAY','IF','NULLIF','COALESCE','CAST',
  'CONVERT','CHAR_LENGTH','REPLACE','IFNULL','STR_TO_DATE'
]);

function highlightSQL(sql) {
  // Escape HTML first
  let out = sql
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');

  // Comments (-- ...)
  out = out.replace(/(--[^\n]*)/g,'<span class="sql-cmt">$1</span>');

  // Strings ('...')  — simple single-pass
  out = out.replace(/'([^']*)'/g,"<span class='sql-str'>'$1'</span>");

  // Numbers
  out = out.replace(/\b(\d+(?:\.\d+)?)\b/g,'<span class="sql-num">$1</span>');

  // Keywords & functions  (word-boundary, case-insensitive)
  out = out.replace(/\b([A-Z_]+)\b/g, (match) => {
    const upper = match.toUpperCase();
    if (SQL_FUNCTIONS.has(upper)) return `<span class="sql-fn">${match}</span>`;
    if (SQL_KEYWORDS.has(upper))  return `<span class="sql-kw">${match}</span>`;
    return match;
  });

  return out;
}


/* ── Render exercise cards ──────────────────────────────────── */
function renderExercises(filter = 'all') {
  const grid = document.getElementById('exercisesGrid');
  grid.innerHTML = '';

  EXERCISES.forEach((ex, idx) => {
    const matchesFilter = filter === 'all' || ex.tags.includes(filter);

    const card = document.createElement('div');
    card.className = 'ex-card';
    card.dataset.tags = ex.tags.join(' ');
    card.style.animationDelay = `${idx * 0.04}s`;
    if (!matchesFilter) card.classList.add('hidden');

    const tagsHtml = ex.tags.map(t =>
      `<span class="ex-tag tag-${t}">${t}</span>`
    ).join('');

    card.innerHTML = `
      <div class="ex-card-header">
        <div class="ex-num">${ex.id}</div>
        <div class="ex-title-wrap">
          <div class="ex-title">${ex.title}</div>
          <div class="ex-tags">${tagsHtml}</div>
        </div>
        <div class="ex-expand-icon">▼</div>
      </div>
      <div class="ex-body">
        <p class="ex-desc">${ex.description}</p>
        <div class="ex-code-wrap">
          <pre class="ex-code"><code>${highlightSQL(ex.sql)}</code></pre>
          <div class="ex-code-actions">
            <button class="btn-copy" data-id="${ex.id}">📋 Copy</button>
            <button class="btn-run-query" data-id="${ex.id}">▶ Run</button>
          </div>
        </div>
        <div class="ex-explanation">${ex.explanation}</div>
      </div>
    `;

    // Toggle expand/collapse
    card.querySelector('.ex-card-header').addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-copy') ||
          e.target.classList.contains('btn-run-query')) return;
      card.classList.toggle('open');
    });

    // Copy button
    card.querySelector('.btn-copy').addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(ex.sql).then(() => {
        const btn = e.currentTarget;
        btn.textContent = '✓ Copied!';
        setTimeout(() => { btn.textContent = '📋 Copy'; }, 1800);
      });
    });

    // Run button: send to runner
    card.querySelector('.btn-run-query').addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('sqlEditor').value = ex.sql;
      document.getElementById('runner').scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => runQuery(), 400);
    });

    grid.appendChild(card);
  });
}


/* ── Filter tabs ────────────────────────────────────────────── */
document.getElementById('exerciseTabs').addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const filter = btn.dataset.filter;
  document.querySelectorAll('.ex-card').forEach(card => {
    const tags = card.dataset.tags || '';
    const visible = filter === 'all' || tags.includes(filter);
    card.classList.toggle('hidden', !visible);
  });
});


/* ════════════════════════════════════════════════════════════
   IN-BROWSER SQL RUNNER (sql.js / SQLite)
════════════════════════════════════════════════════════════ */

let db = null;
let sqlJsReady = false;

async function initDatabase() {
  const meta = document.getElementById('resultsMeta');
  const area = document.getElementById('resultsArea');
  area.innerHTML = `<div class="db-loading"><div class="spinner" style="width:20px;height:20px;margin:0;"></div>Loading SQLite engine…</div>`;

  try {
    const SQL = await initSqlJs({
      locateFile: file =>
        `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`
    });

    db = new SQL.Database();
    createSchema();
    insertSampleData();
    sqlJsReady = true;

    area.innerHTML = `<div class="success-msg">✅ Database ready — 6 tables loaded with sample data. Run a query!</div>`;
    meta.textContent = '6 tables · SQLite';
    document.getElementById('btnRun').disabled = false;
  } catch (err) {
    area.innerHTML = `<div class="error-msg">⚠️ Could not load SQLite engine.<br>${err.message}</div>`;
    console.error('sql.js init failed:', err);
  }
}

function createSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      user_id           INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name         TEXT    NOT NULL,
      email             TEXT    UNIQUE NOT NULL,
      city              TEXT    NOT NULL,
      registration_date DATE    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      event_id      INTEGER PRIMARY KEY AUTOINCREMENT,
      title         TEXT    NOT NULL,
      description   TEXT,
      city          TEXT    NOT NULL,
      start_date    DATETIME NOT NULL,
      end_date      DATETIME NOT NULL,
      status        TEXT    CHECK(status IN ('upcoming','completed','cancelled')),
      organizer_id  INTEGER REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS sessions (
      session_id    INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id      INTEGER REFERENCES events(event_id),
      title         TEXT    NOT NULL,
      speaker_name  TEXT    NOT NULL,
      start_time    DATETIME NOT NULL,
      end_time      DATETIME NOT NULL
    );

    CREATE TABLE IF NOT EXISTS registrations (
      registration_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER REFERENCES users(user_id),
      event_id        INTEGER REFERENCES events(event_id),
      registration_date DATE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS feedback (
      feedback_id   INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id       INTEGER REFERENCES users(user_id),
      event_id      INTEGER REFERENCES events(event_id),
      rating        INTEGER CHECK(rating BETWEEN 1 AND 5),
      comments      TEXT,
      feedback_date DATE    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS resources (
      resource_id   INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id      INTEGER REFERENCES events(event_id),
      resource_type TEXT    CHECK(resource_type IN ('pdf','image','link')),
      resource_url  TEXT    NOT NULL,
      uploaded_at   DATETIME NOT NULL
    );
  `);
}

function insertSampleData() {
  db.run(`
    -- Users
    INSERT INTO users VALUES
      (1,'Alice Johnson','alice@example.com','New York','2024-12-01'),
      (2,'Bob Smith','bob@example.com','Los Angeles','2024-12-05'),
      (3,'Charlie Lee','charlie@example.com','Chicago','2024-12-10'),
      (4,'Diana King','diana@example.com','New York','2025-01-15'),
      (5,'Ethan Hunt','ethan@example.com','Los Angeles','2025-02-01'),
      (6,'Fiona Green','fiona@example.com','Chicago','2025-04-01'),
      (7,'George Hall','george@example.com','New York','2025-04-10'),
      (8,'Hannah Park','hannah@example.com','Los Angeles','2025-05-01'),
      (9,'Ivan Cruz','ivan@example.com','Chicago','2025-05-10'),
      (10,'Julia Moon','julia@example.com','New York','2025-05-15');

    -- Events
    INSERT INTO events VALUES
      (1,'Tech Innovators Meetup','A meetup for tech enthusiasts.','New York','2025-06-10 10:00:00','2025-06-10 16:00:00','upcoming',1),
      (2,'AI & ML Conference','Conference on AI and ML advancements.','Chicago','2025-05-15 09:00:00','2025-05-15 17:00:00','completed',3),
      (3,'Frontend Dev Bootcamp','Hands-on training on frontend tech.','Los Angeles','2025-07-01 10:00:00','2025-07-03 16:00:00','upcoming',2),
      (4,'Data Science Summit','Exploring modern data pipelines.','New York','2025-08-05 09:00:00','2025-08-05 18:00:00','upcoming',1),
      (5,'UX Design Workshop','User research and prototyping.','Chicago','2025-04-20 10:00:00','2025-04-20 15:00:00','completed',3),
      (6,'Cloud Computing Expo','Multi-cloud strategies.','Los Angeles','2025-03-10 09:00:00','2025-03-11 17:00:00','completed',2),
      (7,'Cybersecurity Bootcamp','Ethical hacking essentials.','New York','2025-09-01 09:00:00','2025-09-03 17:00:00','upcoming',4),
      (8,'Open Source Hackathon','Build, collaborate, ship.','Chicago','2025-10-01 08:00:00','2025-10-02 20:00:00','upcoming',1),
      (9,'Blockchain Basics','Intro to Web3 and DeFi.','Los Angeles','2025-05-01 10:00:00','2025-05-01 14:00:00','completed',5),
      (10,'Mobile Dev Summit','React Native vs Flutter.','New York','2025-06-25 10:00:00','2025-06-25 17:00:00','upcoming',3);

    -- Sessions
    INSERT INTO sessions VALUES
      (1,1,'Opening Keynote','Dr. Tech','2025-06-10 10:00:00','2025-06-10 11:00:00'),
      (2,1,'Future of Web Dev','Alice Johnson','2025-06-10 11:15:00','2025-06-10 12:30:00'),
      (3,2,'AI in Healthcare','Charlie Lee','2025-05-15 09:30:00','2025-05-15 11:00:00'),
      (4,3,'Intro to HTML5','Bob Smith','2025-07-01 10:00:00','2025-07-01 12:00:00'),
      (5,3,'CSS Grid Mastery','Bob Smith','2025-07-01 13:00:00','2025-07-01 15:00:00'),
      (6,2,'ML Model Deployment','Dr. Tech','2025-05-15 11:30:00','2025-05-15 13:00:00'),
      (7,4,'Data Wrangling 101','Alice Johnson','2025-08-05 09:00:00','2025-08-05 11:00:00'),
      (8,4,'Real-Time Pipelines','Charlie Lee','2025-08-05 11:30:00','2025-08-05 13:00:00'),
      (9,1,'Closing Panel','Alice Johnson','2025-06-10 10:30:00','2025-06-10 12:00:00'), -- overlaps session 1
      (10,6,'AWS vs Azure','Dr. Tech','2025-03-10 09:00:00','2025-03-10 11:00:00');

    -- Registrations
    INSERT INTO registrations VALUES
      (1,1,1,'2025-05-01'),(2,2,1,'2025-05-02'),(3,3,2,'2025-04-30'),
      (4,4,2,'2025-04-28'),(5,5,3,'2025-06-15'),(6,1,2,'2025-04-25'),
      (7,2,3,'2025-06-10'),(8,3,1,'2025-05-05'),(9,4,1,'2025-05-06'),
      (10,5,2,'2025-04-29'),(11,6,2,'2025-04-27'),(12,7,4,'2025-07-01'),
      (13,8,4,'2025-07-02'),(14,9,5,'2025-04-01'),(15,10,5,'2025-04-02'),
      (16,1,4,'2025-07-03'),(17,2,6,'2025-02-20'),(18,3,6,'2025-02-22'),
      (19,4,9,'2025-04-20'),(20,5,9,'2025-04-21'),(21,6,5,'2025-04-03'),
      (22,7,5,'2025-04-04'),(23,8,3,'2025-06-12'),(24,9,3,'2025-06-13'),
      (25,10,1,'2025-05-07');

    -- Feedback
    INSERT INTO feedback VALUES
      (1,3,2,4,'Great insights!','2025-05-16'),
      (2,4,2,5,'Very informative.','2025-05-16'),
      (3,2,1,3,'Could be better.','2025-06-11'),
      (4,1,2,4,'Loved the AI session.','2025-05-17'),
      (5,5,2,3,'Good but rushed.','2025-05-18'),
      (6,6,2,5,'Excellent keynote!','2025-05-19'),
      (7,9,5,4,'Great workshop.','2025-04-21'),
      (8,10,5,2,'Too basic for me.','2025-04-22'),
      (9,14,6,5,'Cloud deep-dive was superb.','2025-03-12'),
      (10,17,6,4,'Well organised.','2025-03-13'),
      (11,18,6,3,'Average content.','2025-03-14'),
      (12,19,9,5,'Blockchain made simple!','2025-05-02'),
      (13,20,9,4,'Solid intro session.','2025-05-03');

    -- Resources
    INSERT INTO resources VALUES
      (1,1,'pdf','https://portal.com/resources/tech_meetup_agenda.pdf','2025-05-01 10:00:00'),
      (2,2,'image','https://portal.com/resources/ai_poster.jpg','2025-04-20 09:00:00'),
      (3,3,'link','https://portal.com/resources/html5_docs','2025-06-25 15:00:00'),
      (4,2,'pdf','https://portal.com/resources/ai_slides.pdf','2025-04-21 10:00:00'),
      (5,4,'link','https://portal.com/resources/datasci_reading','2025-07-01 08:00:00'),
      (6,6,'pdf','https://portal.com/resources/cloud_whitepaper.pdf','2025-02-28 12:00:00'),
      (7,6,'image','https://portal.com/resources/cloud_expo_banner.png','2025-02-28 12:30:00');
  `);
}

/* ── SQL execution ──────────────────────────────────────────── */
function runQuery() {
  if (!sqlJsReady || !db) {
    document.getElementById('resultsArea').innerHTML =
      `<div class="error-msg">⚠️ Database not ready yet. Please wait a moment.</div>`;
    return;
  }

  const sql    = document.getElementById('sqlEditor').value.trim();
  const area   = document.getElementById('resultsArea');
  const meta   = document.getElementById('resultsMeta');
  const label  = document.getElementById('resultsLabel');

  if (!sql) {
    area.innerHTML = `<div class="error-msg">Write a SQL query first.</div>`;
    return;
  }

  const t0 = performance.now();
  try {
    const results = db.exec(sql);
    const elapsed = (performance.now() - t0).toFixed(1);

    if (!results.length) {
      // DML statement or empty SELECT
      area.innerHTML = `<div class="success-msg">✅ Query executed successfully (no rows returned).</div>`;
      meta.textContent = `0 rows · ${elapsed}ms`;
      label.textContent = 'Results';
      return;
    }

    const { columns, values } = results[0];
    const rowCount = values.length;

    label.textContent = 'Results';
    meta.textContent  = `${rowCount} row${rowCount !== 1 ? 's' : ''} · ${elapsed}ms`;

    let html = `<table class="results-table"><thead><tr>`;
    columns.forEach(col => {
      html += `<th>${escHtml(col)}</th>`;
    });
    html += `</tr></thead><tbody>`;

    values.forEach(row => {
      html += `<tr>`;
      row.forEach((cell, i) => {
        const isNum = typeof cell === 'number';
        const isNull = cell === null || cell === undefined;
        const cls = isNull ? 'result-null' : isNum ? 'result-num' : '';
        const display = isNull ? 'NULL' : escHtml(String(cell));
        html += `<td${cls ? ` class="${cls}"` : ''}>${display}</td>`;
      });
      html += `</tr>`;
    });

    html += `</tbody></table>`;
    area.innerHTML = html;
  } catch (err) {
    area.innerHTML = `<div class="error-msg">❌ SQL Error:<br><br>${escHtml(err.message)}</div>`;
    meta.textContent = 'Error';
    console.error('SQL error:', err);
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

/* ── SQL Formatter (simple keyword-line-break style) ─────── */
function formatSQL() {
  const editor = document.getElementById('sqlEditor');
  let sql = editor.value;

  const BREAK_BEFORE = ['SELECT','FROM','WHERE','JOIN','LEFT JOIN','RIGHT JOIN',
    'INNER JOIN','OUTER JOIN','GROUP BY','ORDER BY','HAVING','LIMIT','OFFSET',
    'UNION','ON','AND','OR'];

  BREAK_BEFORE.forEach(kw => {
    const re = new RegExp(`\\b(${kw})\\b`, 'gi');
    sql = sql.replace(re, (m, p1) => `\n${p1.toUpperCase()}`);
  });

  // Clean up extra blank lines and leading space
  sql = sql.split('\n').map(l => l.trimEnd()).filter((l, i, arr) =>
    !(l.trim() === '' && arr[i-1]?.trim() === '')
  ).join('\n').trim();

  editor.value = sql;
}

/* ── Keyboard shortcuts ─────────────────────────────────────── */
document.getElementById('sqlEditor').addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    runQuery();
  }
});

document.getElementById('btnRun').addEventListener('click', runQuery);
document.getElementById('btnClear').addEventListener('click', () => {
  document.getElementById('sqlEditor').value = '';
  document.getElementById('resultsArea').innerHTML =
    `<div class="results-placeholder"><span class="placeholder-icon">⚡</span><p>Run a query to see results here.</p></div>`;
  document.getElementById('resultsMeta').textContent = '';
  document.getElementById('resultsLabel').textContent = 'Results';
});
document.getElementById('btnFormat').addEventListener('click', formatSQL);


/* ── INIT ────────────────────────────────────────────────────── */
document.getElementById('btnRun').disabled = true;
renderExercises();
initDatabase();
