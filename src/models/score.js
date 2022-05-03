const db = require('../database');

class Score {
  static async getHighScores() {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await db.query(
        'SELECT * FROM score ORDER BY duration ASC LIMIT 10',
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async addScore(name, duration) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await db.query(
        'INSERT INTO score (duration) VALUES ($1) RETURNING *',
        [duration],
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Score;
