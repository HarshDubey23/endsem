const axios = require("axios");
const Employee = require("../models/Employee");

// Generate AI-based performance recommendations for all employees
const getAIRecommendations = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });

    if (!employees.length) {
      return res.status(400).json({
        success: false,
        message: "No employees found. Add employees before generating AI insights.",
      });
    }

    const employeeData = employees.map((emp, index) => ({
      rank: index + 1,
      name: emp.name,
      email: emp.email,
      department: emp.department,
      skills: emp.skills,
      performanceScore: emp.performanceScore,
      experience: emp.experience,
    }));

    const prompt = `You are an HR AI assistant for Employee Performance Analytics.

Analyze the following employee data and provide structured recommendations:

${JSON.stringify(employeeData, null, 2)}

Provide a detailed response with these exact sections:

1. PROMOTION RECOMMENDATIONS
- List employees suitable for promotion with reasons

2. EMPLOYEE RANKING
- Rank all employees from best to lowest performance

3. TRAINING SUGGESTIONS
- Suggest specific training programs per employee or department

4. IMPROVEMENT FEEDBACK
- Provide actionable feedback for low performers

Be professional, concise, and practical. Use bullet points.`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert HR performance analyst. Give clear, structured, exam-friendly recommendations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:6000",
          "X-Title": "Employee Performance Analytics",
        },
      }
    );

    const aiResponse =
      response.data?.choices?.[0]?.message?.content ||
      "No AI response received";

    res.status(200).json({
      success: true,
      message: "AI recommendations generated successfully",
      employeeCount: employees.length,
      employees: employeeData,
      aiRecommendations: aiResponse,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message;

    res.status(500).json({
      success: false,
      message: "Failed to generate AI recommendations",
      error: errorMessage,
    });
  }
};

module.exports = { getAIRecommendations };
