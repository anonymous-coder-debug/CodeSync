const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { isSupportedLanguage, getLanguageConfig } = require('../utils/languageConfig');
const { runOnJudge0 } = require('../services/judge0Service');
const { runOnPiston } = require('../services/pistonService');

// @route   POST /api/code/execute
// Executes user-submitted code against Judge0 or Piston, depending on server config.
// API keys/URLs stay server-side only - never sent to the client.
const executeCode = asyncHandler(async (req, res) => {
  const { language, code, stdin } = req.body;

  if (!language || !isSupportedLanguage(language)) {
    throw new ApiError(400, `Unsupported language: ${language}`);
  }

  if (typeof code !== 'string' || code.trim().length === 0) {
    throw new ApiError(400, 'Code cannot be empty');
  }

  if (code.length > 20000) {
    throw new ApiError(400, 'Code exceeds the maximum allowed length (20,000 characters)');
  }

  const config = getLanguageConfig(language);
  const provider = process.env.CODE_EXEC_PROVIDER === 'judge0' ? 'judge0' : 'piston';

  let result;
  try {
    if (provider === 'judge0') {
      result = await runOnJudge0({
        languageId: config.judge0Id,
        sourceCode: code,
        stdin,
      });
    } else {
      result = await runOnPiston({
        language: config.pistonLanguage,
        version: config.pistonVersion,
        sourceCode: code,
        stdin,
        filename: config.fileName,
      });
    }
  } catch (err) {
    // Bubble up a clean, consistent failure to the frontend instead of a raw stack trace
    if (err instanceof ApiError) throw err;
    throw new ApiError(502, 'Code execution service is currently unavailable');
  }

  res.status(200).json({
    success: true,
    data: {
      provider,
      language,
      ...result,
    },
  });
});

module.exports = { executeCode };
