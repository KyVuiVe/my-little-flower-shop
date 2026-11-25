import { BouquetDesign, ShopStage } from '../types/bouquet';

export function getFloristTip(stage: ShopStage, design: BouquetDesign): string {
  const totalStems = design.flowers.reduce((acc, f) => acc + f.quantity, 0);
  const hasBabysBreath = design.flowers.some((f) => f.flowerId === 'babys-breath');
  const hasLavender = design.flowers.some((f) => f.flowerId === 'lavender');

  switch (stage) {
    case 1:
      if (totalStems === 0) {
        return 'Chào mừng bạn đến với My Little Flower Shop! Hãy chọn vài bông hoa chủ đạo trước nhé.';
      }
      if (!hasBabysBreath && totalStems >= 3) {
        return 'Một chút hoa baby sẽ khiến bó hoa của bạn dịu dàng và bồng bềnh hơn đấy!';
      }
      if (!hasLavender && totalStems >= 6) {
        return 'Thử điểm thêm 1–2 cành oải hương xem, hương thơm và chiều cao bó hoa sẽ rất duyên!';
      }
      if (totalStems >= 15) {
        return 'Bó hoa đang rất đầy đặn rồi! Chuyển sang chọn giấy gói để tôn lên sắc hoa nhé.';
      }
      return 'Bạn có thể phối nhiều màu khác nhau cho cùng một loại hoa để tạo chiều sâu tự nhiên!';
    case 2:
      if (design.wrappingLayers.length === 1) {
        return 'Mẹo nhỏ của tiệm: phối 2–3 lớp giấy gói (ví dụ giấy kem lót trong, giấy kraft hoặc hồng bên ngoài) sẽ rất có chiều sâu!';
      }
      return 'Lớp giấy trong suốt hoặc viền ren đặt ở lớp trong cùng sẽ giúp bó hoa trông mềm như mây đấy!';
    case 3:
      return 'Mỗi kiểu gói sẽ đổi dáng bó hoa ngay trước mắt bạn — thử Korean Style bồng bềnh hoặc Natural phóng khoáng xem nhé!';
    case 4:
      return 'Một chiếc ruy băng nhung hoặc satin cùng tông với hoa chủ đạo sẽ là điểm nhấn hoàn hảo cho bó hoa.';
    case 5:
      if (design.photos.length === 0) {
        return 'Gắn thêm 1–2 tấm ảnh Polaroid kỷ niệm lên bó hoa sẽ khiến người nhận bất ngờ và xúc động lắm đấy!';
      }
      return 'Bạn có thể chỉnh vị trí, kích thước và viết lời chú thích nhỏ dưới mỗi tấm photocard nhé!';
    case 6:
      if (!design.letter.message.trim()) {
        return 'Đừng ngại viết vài dòng chân thành — dù ngắn thôi nhưng viết bằng cả tấm lòng luôn là món quà đẹp nhất.';
      }
      return 'Thử nhấn nút Đóng/Mở thiệp và ký tên bằng tay ở cuối thiệp để món quà thật trọn vẹn nhé!';
    case 7:
      return 'Tuyệt phẩm của bạn đã hoàn thành! Hãy xem trước hiệu ứng mở quà, lưu ảnh PNG hoặc tạo link gửi tặng người thương nhé!';
  }
}
