// Mathematics Curriculum Data & Assets (Grade 1 - Kết nối tri thức với cuộc sống)

export const EMOJI_ITEMS = ['🍎', '⭐', '🎈', '🚗', '🐥', '🥕', '🍓', '🐟', '🌸', '🧁'];

export const DAYS_OF_WEEK = [
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
  'Chủ Nhật'
];

export const SHAPES_DATA = [
  {
    id: 'circle',
    name: 'Hình tròn',
    svg: `<svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="50" fill="#38bdf8" stroke="#0284c7" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'square',
    name: 'Hình vuông',
    svg: `<svg width="120" height="120" viewBox="0 0 120 120">
      <rect x="15" y="15" width="90" height="90" rx="8" fill="#facc15" stroke="#ca8a04" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'triangle',
    name: 'Hình tam giác',
    svg: `<svg width="120" height="120" viewBox="0 0 120 120">
      <polygon points="60,15 110,105 10,105" fill="#f43f5e" stroke="#e11d48" stroke-width="4" stroke-linejoin="round"/>
    </svg>`
  },
  {
    id: 'rectangle',
    name: 'Hình chữ nhật',
    svg: `<svg width="150" height="100" viewBox="0 0 150 100">
      <rect x="10" y="15" width="130" height="70" rx="8" fill="#4ade80" stroke="#16a34a" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'cube',
    name: 'Khối lập phương',
    svg: `<svg width="120" height="120" viewBox="0 0 120 120">
      <!-- 3D Cube Isometric -->
      <polygon points="60,15 105,40 60,65 15,40" fill="#a78bfa" stroke="#6d28d9" stroke-width="3"/>
      <polygon points="15,40 60,65 60,105 15,80" fill="#8b5cf6" stroke="#6d28d9" stroke-width="3"/>
      <polygon points="60,65 105,40 105,80 60,105" fill="#7c3aed" stroke="#6d28d9" stroke-width="3"/>
    </svg>`
  },
  {
    id: 'cuboid',
    name: 'Khối hộp chữ nhật',
    svg: `<svg width="150" height="110" viewBox="0 0 150 110">
      <!-- 3D Cuboid Isometric -->
      <polygon points="50,15 135,35 95,65 10,45" fill="#fb923c" stroke="#ea580c" stroke-width="3"/>
      <polygon points="10,45 95,65 95,100 10,80" fill="#f97316" stroke="#ea580c" stroke-width="3"/>
      <polygon points="95,65 135,35 135,70 95,100" fill="#c2410c" stroke="#ea580c" stroke-width="3"/>
    </svg>`
  }
];

export const GAMES_INFO = [
  {
    id: 'count',
    title: 'Đếm Nhanh Cùng Robot',
    subtitle: 'Chủ đề 1 & 6: Đếm số & Cấu tạo số',
    semester: 1,
    tag: 'Tập 1 & 2',
    tagClass: 'tag-tap1',
    icon: '🔢',
    bgColor: '#e0f2fe',
    desc: 'Đếm số lượng đồ vật, hoa quả ngộ nghĩnh và nhận biết hàng chục, hàng đơn vị.'
  },
  {
    id: 'compare',
    title: 'Bập Bênh So Sánh',
    subtitle: 'Bài 3, 4 & 22: Lớn hơn, Bé hơn, Bằng nhau',
    semester: 1,
    tag: 'Tập 1 & 2',
    tagClass: 'tag-tap1',
    icon: '⚖️',
    bgColor: '#fef3c7',
    desc: 'Quan sát bập bênh hoặc so sánh hai số và chọn dấu đúng: >, < hoặc =.'
  },
  {
    id: 'numberhouse',
    title: 'Ngôi Nhà Tách - Gộp',
    subtitle: 'Bài 5: "Mấy và Mấy" - Tách gộp số',
    semester: 1,
    tag: 'Tập 1',
    tagClass: 'tag-tap1',
    icon: '🏠',
    bgColor: '#ffedd5',
    desc: 'Mô hình nhà số đặc trưng của SGK Toán 1: số ở mái nhà gồm 2 số ở 2 cửa sổ!'
  },
  {
    id: 'math',
    title: 'Khu Vườn Phép Tính',
    subtitle: 'Chủ đề 3 & 8: Phép cộng và trừ',
    semester: 1,
    tag: 'Tập 1 & 2',
    tagClass: 'tag-tap1',
    icon: '🍎',
    bgColor: '#dcfce7',
    desc: 'Giúp Robot tính nhẩm phép cộng, trừ trong phạm vi 10 và mở rộng đến 100.'
  },
  {
    id: 'shapes',
    title: 'Thợ Xây Hình Khối',
    subtitle: 'Chủ đề 2 & 4: Hình phẳng, hình khối & Vị trí',
    semester: 1,
    tag: 'Tập 1',
    tagClass: 'tag-tap1',
    icon: '🔷',
    bgColor: '#f3e8ff',
    desc: 'Nhận diện hình vuông, tròn, tam giác, chữ nhật, khối lập phương và vị trí không gian.'
  },
  {
    id: 'measure',
    title: 'Cây Thước Kì Diệu',
    subtitle: 'Chủ đề 7: Đo độ dài xăng-ti-mét (cm)',
    semester: 2,
    tag: 'Tập 2',
    tagClass: 'tag-tap2',
    icon: '📏',
    bgColor: '#fef9c3',
    desc: 'Dùng thước kẻ centimet để đo chiều dài bút chì, cục tẩy, que kem đáng yêu.'
  },
  {
    id: 'clock',
    title: 'Bác Đồng Hồ & Lịch Vui',
    subtitle: 'Chủ đề 9: Xem giờ đúng & Thứ trong tuần',
    semester: 2,
    tag: 'Tập 2',
    tagClass: 'tag-tap2',
    icon: '⏰',
    bgColor: '#fce7f3',
    desc: 'Xem đồng hồ chỉ mấy giờ đúng và sắp xếp toa tàu ngày trong tuần.'
  }
];

export const BADGES = [
  { id: 'first_game', title: 'Ngôi Sao Khởi Đầu', icon: '🌟', reqStars: 5, desc: 'Đạt 5 ngôi sao đầu tiên' },
  { id: 'master_math', title: 'Thần Đồng Tính Nhẩm', icon: '⚡', reqStars: 15, desc: 'Đạt 15 ngôi sao trong các phép tính' },
  { id: 'master_shapes', title: 'Kiến Trúc Sư Nhí', icon: '📐', reqStars: 25, desc: 'Chinh phục các thử thách hình khối' },
  { id: 'time_traveler', title: 'Chuyên Gia Thời Gian', icon: '🧭', reqStars: 35, desc: 'Nắm vững giờ giấc và thứ trong tuần' },
  { id: 'math_champion', title: 'Quán Quân Toán 1', icon: '🏆', reqStars: 50, desc: 'Hoàn thành xuất sắc 50 sao toán học!' }
];

export const ROBOT_CHEERS = [
  'Bé giỏi quá! Tuyệt vời lắm!',
  'Chính xác rồi! Tiếp tục phát huy nhé!',
  'Xuất sắc! Bé thông minh quá!',
  'Hoan hô! Thêm một ngôi sao nữa rồi!',
  'Đúng rồi! Bạn Robot rất tự hào về bé!'
];

export const ROBOT_ENCOURAGE = [
  'Gần đúng rồi, bé thử lại xem sao nhé!',
  'Đừng lo, hãy đếm cẩn thận lại một lần nữa nhé!',
  'Bé quan sát kĩ hơn một chút nào!',
  'Cố lên nào, bạn Robot tin bé sẽ làm được!'
];
