
import { GoogleGenAI } from "@google/genai";
import { MenuItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartRecommendation = async (menu: MenuItem[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Dựa trên menu sau đây của tiệm Mỳ Coffee & Tea, hãy chọn ra 1 món 'Best Seller' cho ngày hôm nay và viết một câu quảng cáo ngắn (dưới 20 từ) cực kỳ hấp dẫn theo phong cách Tết.
      Menu: ${menu.map(m => m.name).join(', ')}`,
    });
    return response.text || "Chúc mừng năm mới! Thử ngay Cà Phê Sữa đậm đà!";
  } catch (error) {
    console.error("AI Error:", error);
    return "Mỳ Coffee & Tea kính chúc quý khách vạn sự như ý!";
  }
};
