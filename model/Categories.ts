export interface Category {
    name: string,
    title: string,
    url?: string,
    icon: string,
    color?: string
}

interface Categories {
    language: string
    categories: Category[]
}

const categories: Categories[] = [
    {
        language: "vi",
        categories: [
            {
                name: 'tin-nong',
                title: 'Tin nóng',
                url: '',
                icon: 'whatshot',
                color: 'blue'
            },
            {
                name: 'xa-hoi',
                title: 'Xã hội',
                icon: 'people',
                color: 'orange'


            },
            {
                name: 'thoi-su',
                title: 'Thời sự',
                icon: 'list_alt',
                color: 'yellow'


            },
            {
                name: 'the-thao',
                title: 'Thể thao',
                icon: 'directions_bike',
                color: 'red'

            },
            {
                name: 'khoa-hoc-cong-nghe',
                title: 'Công nghệ',
                icon: 'phone_iphone',
                color: 'green'

            },
            {
                name: 'tinh-te',
                title: 'Tinh tế',
                icon: 'phone_iphone',
                color: 'green'

            },

            {
                name: 'tin-video',
                title: 'Video',
                icon: 'videocam',
                color: 'cyan'

            },
            {
                name: 'yeu-thich',
                title: 'Yêu thích',
                icon: 'favorite',
                color: 'red'

            }
        ]
    },
    {
        language: "en",
        categories: [
            {
                name: 'general',
                title: 'General',
                icon: 'whatshot',
                color: 'blue'
            },
            {
                name: 'business',
                title: 'Business',
                icon: 'business',
                color: 'yellow'
            }, {
                name: 'technology',
                title: 'Technology',
                icon: 'phone_iphone',
                color: 'red'
            }, {
                name: 'entertainment',
                title: 'Entertainment',
                icon: 'movie',
                color: 'green'
            }, {
                name: 'health',
                title: 'Health',
                icon: 'people',
                color: 'cyan'
            }, {
                name: 'science',
                title: 'Science',
                icon: 'people'
            }, {
                name: 'sports',
                title: 'Sports',
                icon: 'directions_bike',
                color: 'red'
            },


        ]
    }
];

export default class CategoryHelper {

    static findByName(name: string): Category {

        let vietnameCategory = this.vietnameseCategories();
        let englishCategory = this.englishCategories();
        let categories = [];
        categories = categories.concat(vietnameCategory);
        categories = categories.concat(englishCategory);
        return categories.find(category => category.name === name)
    }

    static vietnameseCategories(): Category[] {
        return categories.find(c => c.language === 'vi').categories;
    }

    static englishCategories(): Category[] {
        return categories.find(c => c.language === 'en').categories;
    }
}


// XÃ HỘI
// THỜI SỰ
// GIAO THÔNG
// MÔI TRƯỜNG - KHÍ HẬU
// THẾ GIỚI
// VĂN HÓA
// NGHỆ THUẬT
// ẨM THỰC
// DU LỊCH
// KINH TẾ
// KINH DOANH
// LAO ĐỘNG - VIỆC LÀM
// TÀI CHÍNH
// CHỨNG KHOÁN
// GIÁO DỤC
// HỌC BỔNG - DU HỌC
// ĐÀO TẠO - THI CỬ
// THỂ THAO
// BÓNG ĐÁ QUỐC TẾ
// BÓNG ĐÁ VIỆT NAM
// QUẦN VỢT
// GIẢI TRÍ
// ÂM NHẠC
// THỜI TRANG
// ĐIỆN ẢNH - TRUYỀN HÌNH
// PHÁP LUẬT
// HÌNH SỰ - DÂN SỰ
// AN NINH - TRẬT TỰ
// CÔNG NGHỆ
// CNTT - VIỄN THÔNG
// THIẾT BỊ - PHẦN CỨNG
// KHOA HỌC
// ĐỜI SỐNG
// DINH DƯỠNG - LÀM ĐẸP
// TÌNH YÊU - HÔN NHÂN
// SỨC KHỎE - Y TẾ
// XE CỘ
// NHÀ ĐẤT
// QUẢN LÝ - QUY HOẠCH
// KHÔNG GIAN - KIẾN TRÚC
