import React from "react";
import styles from '../styles/Introduction.module.css';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
// import CamKet from 'images/Cam_Ket.png';
const Introduction = () => {
    return (
        <div className={styles.Introduction}>
            <Navbar />
                <div className={styles.container}>
                    <div className={styles.Header}>
                        <div className={styles.Headertext}>
                            <h1>Bình Minh store</h1>
                            <p>Nơi công nghệ chạm tới cảm xúc</p>
                        </div>
                        <img src="/logovector.png" alt="Logo Bình Minh store" />
                    </div>
                    <div className={styles.Content}>
                       <section className={styles.Section1}>
                            <h2>Khởi nguồn của cái tên "Bình Minh"</h2>
                            <p>
                                Mọi hành trình vĩ đại đều bắt đầu từ một bước chân nhỏ. Câu chuyện của <strong>Bình Minh Mobile</strong> cũng vậy.
                            </p>
                            <p>
                                Cách đây không lâu, chúng tôi nhận ra rằng thị trường điện thoại di động đang thay đổi chóng mặt. Công nghệ phát triển quá nhanh đôi khi khiến người dùng cảm thấy choáng ngợp. Người ta dễ dàng mua được một chiếc điện thoại, nhưng rất khó để tìm được một nơi tư vấn thật sự "có tâm".
                            </p>
                            <p>
                                Cái tên <strong>"Bình Minh"</strong> ra đời từ chính trăn trở đó. Bình minh là khoảnh khắc đẹp nhất trong ngày, báo hiệu sự khởi đầu mới mẻ. Chúng tôi muốn mỗi khi khách hàng bước ra khỏi cửa hàng, họ sẽ cảm thấy như mình đang bắt đầu một hành trình trải nghiệm mới.
                            </p>
                       </section>
                        <section className={styles.Section2}>
                            <h2>Sứ mệnh không chỉ là "Bán hàng"</h2>
                            <h3>Kết nối thế giới</h3>
                            <p>Mang đến những thiết bị thông minh giúp công việc hiệu quả hơn, giải trí tuyệt vời hơn.</p>
                            <h3>Kết nối giá trị thực</h3>
                            <p>Trong một thị trường "thượng vàng hạ cám", chúng tôi cam kết chỉ mang đến những sản phẩm chất lượng nhất, xứng đáng với từng đồng bạn bỏ ra.</p>
                            <h3>Kết nối cảm xúc</h3>
                            <p>Chúng tôi luôn lắng nghe câu chuyện của bạn. Bạn cần một chiếc điện thoại pin "trâu" để chạy xe công nghệ? Bạn cần camera xịn để lưu giữ khoảnh khắc con cái khôn lớn? Hay đơn giản là một món quà biếu bố mẹ? Chúng tôi thấu hiểu và đưa ra giải pháp phù hợp nhất, chứ không phải chiếc máy đắt tiền nhất.</p>                                                   
                        </section>
                        <section className={styles.Section3}>
                            <img src="images/Cam_Ket.png" alt="Cam kết từ trái tim" />
                        </section>
                        <section className={styles.Section4}>
                            <h2>Tầm nhìn tương lai</h2>
                            <p>Chúng tôi mơ ước về một hệ sinh thái công nghệ nơi <strong>Bình Minh store</strong> là điểm đến đầu tiên bạn nghĩ tới. Không chỉ dừng lại ở điện thoại, trong tương lai gần, chúng tôi sẽ mở rộng sang các thiết bị thông minh khác (SmartHome, phụ kiện cao cấp...) để phục vụ cuộc sống hiện đại của người Việt.</p>
                            <p>Nhưng dù đi xa đến đâu, triết lý cốt lõi của chúng tôi vẫn vẹn nguyên: <strong>"Khách hàng là người thân"</strong>. Sự hài lòng của bạn chính là ánh bình minh rực rỡ nhất mà chúng tôi luôn hướng tới mỗi ngày.</p>
                        </section>
                        <section className={styles.end}>
                            <h3 className={styles.EndLine}>Cảm ơn bạn đã ghé thăm ngôi nhà công nghệ của chúng tôi!</h3>
                            <p>Hãy để Bình Minh đồng hành cùng bạn trong kỷ nguyên số.</p>
                        </section>
                        <img src="/logovector.png" alt="Logo Bình Minh store" className={styles.Logo}/>
                    </div>
                </div>
            {/* <Footer /> */}
        </div>
    );
};
export default Introduction;