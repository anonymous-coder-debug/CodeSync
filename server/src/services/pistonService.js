const axios = require('axios');
const ApiError = require('../utils/ApiError');

// Runs code via the free Piston API (https://github.com/engineer-man/piston).
// No API key required. Good default/fallback for local development.
const runOnPiston = async ({ language, version, sourceCode, stdin, filename }) => {
  const baseURL = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston';

  try {
    const { data } = await axios.post(
      `${baseURL}/execute`,
      {
        language,
        version,
        files: [{ name: filename, content: sourceCode }],
        stdin: stdin || '',
      },
      { timeout: 20000 }
    );

    const run = data.run || {};
    const compile = data.compile || {};

    return {
      stdout: run.stdout || '',
      stderr: run.stderr || compile.stderr || '',
      compileOutput: compile.stdout || '',
      status: run.code === 0 ? 'Accepted' : `Exited with code ${run.code}`,
      time: null,
      memory: null,
    };
  } catch (err) {
    if (err.response) {
      throw new ApiError(502, `Piston request failed: ${err.response.status}`);
    }
    if (err.code === 'ECONNABORTED') {
      throw new ApiError(504, 'Piston request timed out');
    }
    throw new ApiError(502, 'Failed to reach Piston execution service');
  }
};

module.exports = { runOnPiston };
