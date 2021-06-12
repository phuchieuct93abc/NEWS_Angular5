import Article from "../model/Article";

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
const jsdom = require("jsdom");

const {JSDOM} = jsdom;

const sanitize = (text: string): string=>{
  const dom = new JSDOM(`<!DOCTYPE html><body>${text}</body>`);
  dom.window.document.querySelector("a").remove();
  dom.window.document.querySelector("img").remove();
  dom.window.document.querySelector("script").remove();


 let escapedLines = dom.window.document.querySelector("body").textContent.trim();;
 escapedLines = escapedLines.replace(/&/g, '&amp;');
 escapedLines = escapedLines.replace(/"/g, '&quot;');
 escapedLines = escapedLines.replace(/</g, '&lt;');
 escapedLines = escapedLines.replace(/>/g, '&gt;');
 return escapedLines;

}
export async function ttsArticle(article: Article) {
  let body ='  <p class="body-image"><img src="https://photo-baomoi.zadn.vn/w500_r1/2021_06_12_357_39163086/e6d3d6b5d8f731a968e6.jpg"></p><p class="body-text media-caption"><em> Ông Donald Trump nói đang ‘viết điên cuồng’ để tạo ra cuốn sách để đời. </em></p><p class="body-text">"Tôi đang viết điên cuồng", cựu Tổng thống Mỹ Donald Trump cho biết trong một tuyên bố thông qua siêu ủy ban hành động chính trị (PAC) mang tên "Save America" của mình.</p><p class="body-text">Ông Trump khẳng định đây sẽ là cuốn sách để đời của ông và ông vẫn chưa nhận lời để nghị phát hành của nhà xuất bản nào.</p><p class="body-text">Vị cựu tổng thống cũng chia sẻ thêm rằng ông đang đang "thực hiện một dự án quan trọng hơn nhiều" nhưng không tiết lộ đó là dự án gì.</p><p class="body-text">Kể từ khi rời Nhà Trắng, ông Trump được cho là đã gặp một số nhà báo nổi tiếng để thực hiện các cuộc phỏng vấn cho những cuốn sách sắp ra mắt về nhiệm kỳ tổng thống của mình.</p><p class="body-text">"Chúng tôi không thảo luận chi tiết về những cuốn sách mà cựu Tổng thống Trump sẽ ra mắt, nhưng có thể chắc chắn khi nói rằng ông ấy vẫn là cái tên nóng nhất trong chính trị và ông ấy là đối tượng phỏng vấn mà mọi người đều muốn", Jason Miller, người phát ngôn của ông Trump, nói hồi tháng 3.</p><p class="body-text">Ông Miller đồng thời tỏ ra khá lạc quan rằng ông Trump sẽ thành công với cuốn sách sắp ra mắt.</p><p class="body-text">Các cựu tổng thống thường phát hành hồi ký sau khi rời nhiệm sở, mang lại doanh thu lớn cho các nhà xuất bản. Đơn cử như cuốn sách "Miền đất hứa" (A Promised Land) của cựu Tổng thống Mỹ Barack Obama, được xuất bản tháng 11/2020 và bán được hơn 3 triệu bản trong tháng đầu tiên. Hồi ký "Những thời điểm quyết định" (Decision Points) của cựu tổng thống George W. Bush, ra mắt năm 2010 và trở thành cuốn sách bán chạy nhất của New York Times.</p><p class="body-text">Trước khi trở thành tổng thống, ông Trump đã ra mắt hơn chục cuốn sách liên quan đến bất động sản và kinh doanh.</p><p class="body-text">Từ khi bị cấm khỏi các nền tảng mạng xã hội, ông Trump mất khả năng kết nối với hàng triệu người theo dõi, gồm 88 triệu người trên Twitter, 32 triệu người trên Facebook và 24 triệu người trên Instagram.</p><p class="body-text">Ở động thái liên quan mới nhất, trang blog cá nhân "Từ bàn làm việc của Donald J. Trump" của ông Trump đã chính thức đóng cửa hồi đầu tháng 6 sau gần 1 tháng hoạt động. Cố vấn Jason Miller của ông Trump cho biết "đây chỉ là phụ trợ cho những nỗ lực lớn hơn mà chúng tôi đã và đang thực hiện".</p><p class="body-text">Theo NBCNews, có lẽ vấn đề nằm ở website của ông là nền tảng giao tiếp một chiều, khiến người đọc không thể bình luận trên bài đăng hay trò chuyện cùng ông mà chỉ có thể chia sẻ bài về các trang khác, dẫn tới tương tác lẫn lượt xem đều thấp.</p><p class="body-text body-author"><strong>Thanh Tú</strong></p><p class="body-text body-author"><strong>Theo Business Insider</strong></p><p class="bm-source"><a href="/ong-trump-noi-dang-viet-dien-cuong-de-tao-ra-cuon-sach-de-doi/r/39163086.epi" title="Xem bài gốc" target="_blank" rel="nofollow"><span class="short-name">Nguồn Vietnam Finance</span><span class="source" style="word-break: break-all;">https://vietnamfinance.vn/ong-trump-noi-dang-viet-dien-cuong-de-tao-ra-cuon-sach-de-doi-20180504224254388.htm</span></a></p><div class="fyi nocontent robots-nocontent" id="BaoMoi_Article_OA"><script> var BaoMoi_Article_OA_ID = "oa_target";</script></div>';
  let text = [article.header, article.description , sanitize(article.body)].join("\n");


  text = `<speak>${text.substring(0,4000)}</speak>`;
  

  // Convert plaintext to SSML
  // Tag SSML so that there is a 2 second pause between each address
  const expandedNewline = text.replace(/\n/g, '\n<break time=\"2\" />');
    // Construct the request
    console.log("Start",expandedNewline)
  const request = {
    input: {ssml: expandedNewline},
    // Select the language and SSML voice gender (optional)
    voice: {
      languageCode: 'vi-VN', 
      ssmlGender: 'FEMALE',
      name:'vi-VN-Wavenet-C',
    },
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

    
  
  

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);

return response.audioContent;
}
