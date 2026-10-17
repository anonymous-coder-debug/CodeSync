const axios = require('axios');
const ApiError = require('../utils/ApiError');

// Runs code via a Judge0 instance (RapidAPI or self-hosted).
// Requires JUDGE0_API_URL (+ JUDGE0_API_KEY/JUDGE0_API_HOST if using RapidAPI).
const runOnJudge0 = async ({ languageId, sourceCode, stdin }) => {
  const baseURL = process.env.JUDGE0_API_URL;
  if (!baseURL) {
    throw new ApiError(500, 'Judge0 is not configured on the server');
  }

  const headers = { 'Content-Type': 'application/json' };
  if (process.env.JUDGE0_API_KEY) {
    headers['X-RapidAPI-Key'] = process.env.JUDGE0_API_KEY;
    headers['X-RapidAPI-Host'] = process.env.JUDGE0_API_HOST;
  }

  try {
    const { data } = await axios.post(
      `${baseURL}/submissions?base64_encoded=false&wait=true`,
      {
        language_id: languageId,
        source_code: sourceCode,
        stdin: stdin || '',
      },
      { headers, timeout: 20000 }
    );

    return {
      stdout: data.stdout || '',
      stderr: data.stderr || '',
      compileOutput: data.compile_output || '',
      status: data.status ? data.status.description : 'Unknown',
      time: data.time || null,
      memory: data.memory || null,
    };
  } catch (err) {
    if (err.response) {
      throw new ApiError(502, `Judge0 request failed: ${err.response.status}`);
    }
    if (err.code === 'ECONNABORTED') {
      throw new ApiError(504, 'Judge0 request timed out');
    }
    throw new ApiError(502, 'Failed to reach Judge0 execution service');
  }
};

module.exports = { runOnJudge0 };
