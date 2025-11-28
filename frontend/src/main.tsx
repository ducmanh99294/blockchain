import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3001}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </StrictMode>,
);

[
  {
    "distributor": {"$oid":"68ce52f7f95790dba090950f"},
    "name": "Aspirin 81mg",
    "description": "Thuốc chống kết tập tiểu cầu, hỗ trợ tim mạch.",
    "category": {"$oid":"68d976120cfbde14ac5f462c"},
    "brand": "Bayer",
    "image": ["https://cdn.famitaa.net/storage/uploads/noidung/kirkland-low-dose-aspirin-81mg-2-x-365-vien_00654.jpg"],
    "usage": "1 viên/ngày sau ăn.",
    "price": 30000,
    "stock": 120,
    "expiryDate": "2026-09-10",
    "status": "not_not_verified",
    "imagesOrigin": [],
    "originInfo": "Nhập khẩu từ Đức",
    "blockchainTx": "0x00221acbbd22ccaa",
    "ipfsCidString": [],
    "createdAt": "2025-01-18T10:15:00Z"
  },
  {
    "distributor": {"$oid":"68ce52f7f95790dba090950f"},
    "name": "Calcium + Vitamin D3",
    "description": "Bổ sung canxi và vitamin D3 cho xương.",
    "category": {"$oid":"68d976120cfbde14ac5f462c"},
    "brand": "Ostelin",
    "image": ["https://glucosamin.com.vn/storage/uploads/noidung/calcium-600mg-vitamin-d3-kirkland-347.jpg"],
    "usage": "2 viên/ngày sau ăn.",
    "price": 210000,
    "stock": 60,
    "expiryDate": "2027-03-22",
    "status": "not_not_verified",
    "imagesOrigin": [],
    "originInfo": "Nhập khẩu Úc",
    "blockchainTx": null,
    "ipfsCidString": [],
    "createdAt": "2025-01-19T08:00:00Z"
  },
  {
    "distributor": {"$oid":"68ce52f7f95790dba090950f"},
    "name": "Dạ Dày - Gastropulgite",
    "description": "Hỗ trợ điều trị viêm loét dạ dày, trào ngược.",
    "category": {"$oid":"68d976120cfbde14ac5f462f"},
    "brand": "Ipsen",
    "image": ["https://www.vinmec.com/static/uploads/small_20220305_065641_310418_thuoc_gastropulgite_max_1800x1800_jpg_2f81692ec1.jpg"],
    "usage": "1 gói x 3 lần/ngày.",
    "price": 55000,
    "stock": 150,
    "expiryDate": "2026-11-30",
    "status": "not_verified",
    "imagesOrigin": ["origin_gastro1.jpg"],
    "originInfo": "Nhập khẩu Pháp",
    "blockchainTx": "0x77bb992233ddaa55",
    "ipfsCidString": [],
    "createdAt": "2025-01-20T14:00:00Z"
  },
  {
    "distributor": {"$oid":"68ce52f7f95790dba090950f"},
    "name": "Men vi sinh Enterogermina",
    "description": "Cân bằng hệ vi sinh đường ruột.",
    "category": {"$oid":"68d976120cfbde14ac5f462f"},
    "brand": "Sanofi",
    "image": ["https://cdn.thegioididong.com/Products/Images/12098/131144/enterogermina-5ml-2-1.jpg"],
    "usage": "2–3 ống/ngày.",
    "price": 105000,
    "stock": 80,
    "expiryDate": "2027-01-10",
    "status": "not_verified",
    "imagesOrigin": [],
    "originInfo": "Italy",
    "blockchainTx": "",
    "ipfsCidString": [],
    "createdAt": "2025-01-22T09:45:00Z"
  },
  {
    "distributor": {"$oid":"68ce52f7f95790dba090950f"},
    "name": "Thuốc ho Prospan",
    "description": "Giảm ho từ chiết xuất lá thường xuân.",
    "category": {"$oid":"68d976120cfbde14ac5f462d"},
    "brand": "Prospan",
    "image": ["https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/P00296_1.jpg"],
    "usage": "5ml x 2–3 lần/ngày.",
    "price": 85000,
    "stock": 200,
    "expiryDate": "2026-08-15",
    "status": "not_not_verified",
    "imagesOrigin": [],
    "originInfo": "Đức",
    "blockchainTx": "",
    "ipfsCidString": [],
    "createdAt": "2025-01-23T07:20:00Z"
  },
  {
    "distributor": {"$oid":"68ce52f7f95790dba090950f"},
    "name": "Thuốc trị cảm cúm Decolgen",
    "description": "Giảm triệu chứng cảm cúm, nghẹt mũi.",
    "category": {"$oid":"68d976120cfbde14ac5f462b"},
    "brand": "United Pharma",
    "image": ["https://cdn.thegioididong.com/Products/Images/10022/206307/decolgen-no-browse-vi-bam-h-120v-2-1.jpg"],
    "usage": "1 viên x 3 lần/ngày.",
    "price": 12000,
    "stock": 500,
    "expiryDate": "2027-04-05",
    "status": "not_verified",
    "imagesOrigin": [],
    "originInfo": "Việt Nam",
    "blockchainTx": null,
    "ipfsCidString": [],
    "createdAt": "2025-01-25T11:30:00Z"
  },
  {
    "distributor": {"$oid":"68ce52f7f95790dba090950f"},
    "name": "Hoạt huyết bổ não Ginkgo Biloba",
    "description": "Cải thiện trí nhớ, tuần hoàn máu não.",
    "category": {"$oid":"68d976120cfbde14ac5f4630"},
    "brand": "DHG Pharma",
    "image": ["https://cf.shopee.vn/file/0ad3bca7a3a86d968e81e7a04369e58d"],
    "usage": "1 viên x 2 lần/ngày.",
    "price": 95000,
    "stock": 130,
    "expiryDate": "2026-12-01",
    "status": "not_verified",
    "imagesOrigin": [],
    "originInfo": "Việt Nam",
    "blockchainTx": null,
    "ipfsCidString": [],
    "createdAt": "2025-01-26T13:40:00Z"
  },
  {
    "distributor": {"$oid":"68ce52f7f95790dba090950f"},
    "name": "Kháng sinh Amoxicillin 500mg",
    "description": "Điều trị nhiễm trùng do vi khuẩn.",
    "category": {"$oid":"68d976120cfbde14ac5f462e"},
    "brand": "Mediplantex",
    "image": ["https://cdn.thegioididong.com/Products/Images/10026/230085/amoxicillin-500mg-brawn-h-100v-2-1.jpg"],
    "usage": "1 viên x 2–3 lần/ngày.",
    "price": 18000,
    "stock": 300,
    "expiryDate": "2025-12-20",
    "status": "not_not_verified",
    "imagesOrigin": [],
    "originInfo": "Việt Nam",
    "blockchainTx": "",
    "ipfsCidString": [],
    "createdAt": "2025-01-27T10:00:00Z"
  },
  {
    "distributor": {"$oid":"68ce52f7f95790dba090950f"},
    "name": "Nước súc miệng Listerine",
    "description": "Kháng khuẩn, ngừa hôi miệng.",
    "category": {"$oid":"68d976120cfbde14ac5f462e"},
    "brand": "Listerine",
    "image": ["https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/20241231034734-1-P02439_1.jpg?versionId=PC_5Hc8xkuPhZzQUXUpB.BKZR7IUicdD"],
    "usage": "20ml súc miệng trong 30 giây.",
    "price": 45000,
    "stock": 250,
    "expiryDate": "2027-06-01",
    "status": "not_verified",
    "imagesOrigin": [],
    "originInfo": "Malaysia",
    "blockchainTx": "",
    "ipfsCidString": [],
    "createdAt": "2025-01-28T15:00:00Z"
  },
  {
    "distributor": {"$oid":"68ce52f7f95790dba090950f"},
    "name": "Dung dịch nhỏ mắt V.Rohto",
    "description": "Chống mỏi mắt, đỏ mắt.",
    "category": {"$oid":"68d976120cfbde14ac5f462e"},
    "brand": "Rohto",
    "image": ["https://rohto.com.vn/images/2023/vrohto-vitamin-20230612.jpg"],
    "usage": "Nhỏ 2–3 giọt mỗi lần.",
    "price": 30000,
    "stock": 180,
    "expiryDate": "2026-03-18",
    "status": "not_verified",
    "imagesOrigin": [],
    "originInfo": "Nhật Bản",
    "blockchainTx": null,
    "ipfsCidString": [],
    "createdAt": "2025-01-30T08:30:00Z"
  }
]
