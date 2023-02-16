import { CustomResponse } from '../utils/CreateResponse';

export const ACCOUNT_CREATED: CustomResponse = {
	code: 0,
	message: 'Hesabınız oluşturuldu!',
	error: false,
};

export const ALREADY_IN_USE: CustomResponse = {
	code: 1,
	message: 'Bu alandaki değerler daha önce kullanılmış!',
};

export const USERNAME_OR_PASSWORD_NOT_FOUND: CustomResponse = {
	code: 2,
	message: 'E-posta/telefon veya şifre bulunamadı!',
	fields: ['emailOrPhone', 'password'],
};

export const SUCCESSFUL_LOGIN: CustomResponse = {
	code: 3,
	message: 'Giriş başarıyla yapıldı!',
	error: false,
};

export const SUCCESSFUL_FORGOT_PASSWORD: CustomResponse = {
	code: 4,
	message:
		'Böyle bir kullanıcı varsa e-posta adresine sıfırlama bağlantısı gönderildi!',
	error: false,
};

export const FAILED_FORGOT_PASSWORD: CustomResponse = {
	code: 5,
	message: 'Kullandığınız bağlantının süresi geçmiş olabilir',
};

export const USER_CANNOT_BE_FOUND: CustomResponse = {
	code: 6,
	message: 'Kullanıcı bulunamadı! Lütfen tekrar deneyin.',
};

export const SAME_PASSWORD: CustomResponse = {
	code: 7,
	message: 'Oluşturacağınız şifre öncekiyle aynı olamaz.',
	fields: ['password', 'confirmPassword'],
};

export const PASSWORD_CHANGED: CustomResponse = {
	code: 8,
	message: 'Şifreniz başarıyla değiştirildi!',
	error: false,
};

export const EMPTY_ID: CustomResponse = {
	code: 9,
	message: 'ID kısmı boş bırakılamaz.',
	fields: 'id',
};

export const CATEGORY_CANNOT_BE_FOUND: CustomResponse = {
	code: 10,
	message: 'Kategori bulunamadı.',
};

export const COMPANY_CANNOT_BE_FOUND: CustomResponse = {
	code: 11,
	message: 'Şirket bulunamadı.',
};

export const OWNER_ERROR: CustomResponse = {
	code: 12,
	message: 'Sadece sahibi olduğunuz öğeleri değiştirebilirsiniz.',
};

export const LIMIT_REACHED: CustomResponse = {
	code: 13,
	message:
		'Oluşturma limitine ulaştınız. Daha fazla oluşturmak için hesabınızı yükseltin veya var olanları silin.',
};

export const CATEGORY_CREATED: CustomResponse = {
	code: 14,
	message: 'Kategori başarıyla oluşturuldu!',
	error: false,
};

export const CATEGORY_REMOVED: CustomResponse = {
	code: 15,
	message: 'Kategori başarıyla silindi!',
	error: false,
};

export const CATEGORY_REMOVE_ERROR: CustomResponse = {
	code: 16,
	message: 'Kategori silinirken bir hatayla karşılaşıldı.',
};

export const NO_TABLE_FOUND: CustomResponse = {
	code: 17,
	message: 'Belirtilen şirketin hiçbir masası bulunamadı!',
};

export const NO_CATEGORY_FOUND: CustomResponse = {
	code: 18,
	message: 'Belirtilen şirketin hiçbir kategorisi bulunamadı!',
};

export const COMPANY_REMOVED: CustomResponse = {
	code: 19,
	message: 'Şirket başarıyla silindi!',
	error: false,
};

export const COMPANY_REMOVE_ERROR: CustomResponse = {
	code: 20,
	message: 'Şirket silinirken bir hata ile karşılaşıldı',
};

export const FOOD_CANNOT_BE_FOUND: CustomResponse = {
	code: 21,
	message: 'Yiyecek bulunamadı!',
};

export const FOOD_CREATED: CustomResponse = {
	code: 22,
	message: 'Yeni yiyecek başarıyla oluşturuldu.',
	error: false,
};

export const FOOD_REMOVED: CustomResponse = {
	code: 23,
	message: 'Yiyecek başarıyla silindi!',
	error: false,
};

export const FOOD_REMOVE_ERROR: CustomResponse = {
	code: 24,
	message: 'Yiyecek silinirken bir hata ile karşılaşıldı!',
};

export const TABLE_CANNOT_BE_FOUND: CustomResponse = {
	code: 25,
	message: 'Masa bulunamadı.',
};

export const FOOD_NOT_OWNED: CustomResponse = {
	code: 26,
	message: 'Bu yiyecek bu şirket üzerine kayıtlı değil!',
};

export const FOOD_ADDED_ON_TABLE: CustomResponse = {
	code: 27,
	message: 'Masaya başarıyla yeni yiyecek eklendi!',
	error: false,
};

export const FOOD_FAILED_ON_TABLE: CustomResponse = {
	code: 28,
	message: 'Masaya yiyecek eklenirken bir hatayla karşılaşıldı!',
};

export const TABLE_CREATED: CustomResponse = {
	code: 29,
	message: 'Başarıyla masa oluşturuldu!',
	error: false,
};

export const TABLE_REMOVED: CustomResponse = {
	code: 30,
	message: 'Masa başarıyla silindi!',
	error: false,
};

export const TABLE_REMOVE_FAILED: CustomResponse = {
	code: 31,
	message: 'Masa silinirken bir hata ile karşılaşıldı!',
};

export const USER_REMOVED: CustomResponse = {
	code: 32,
	message: 'Kullanıcı başarıyla silindi!',
	error: false,
};

export const USER_REMOVE_FAILED: CustomResponse = {
	code: 33,
	message: 'Kullanıcı silinirken bir hata ile karşılaşıldı.',
};

export const MFA_ALREADY_ACTIVE: CustomResponse = {
	code: 34,
	message: 'Zaten çift faktörlü doğrulamanız etkin!',
};

export const MFA_ACTIVATION_FAILED: CustomResponse = {
	code: 35,
	message:
		'Çift faktörlü doğrulama etkinleştirilirken bir hatayla karşılaşıldı!',
};

export const TRY_AGAIN_SERVER: CustomResponse = {
	code: 36,
	message: 'Sunucularda bir hata oluştu, lütfen işlemi yeniden başlatınız.',
};

export const MFA_FAILED: CustomResponse = {
	code: 37,
	message: 'Lütfen uygulamadaki 6 haneli kodu girin.',
	fields: 'code',
};

export const MFA_INCORRECT: CustomResponse = {
	code: 38,
	message: '6 haneli kodunuz doğru değil!',
	fields: 'code',
};

export const MFA_SUCCEEDED: CustomResponse = {
	code: 39,
	message: 'Çift faktörlü doğrulamanız etkinleştirildi.',
	error: false,
};

export const AUTH_ERROR: CustomResponse = {
	code: 40,
	message: 'Bu işlemi yapmak için giriş yapmalısınız!',
};

export const MUST_BE_INT: CustomResponse = {
	code: 41,
	message: 'Girdiğiniz veriler tam sayı olmalı.',
};

export const NOT_AUTH_ERROR: CustomResponse = {
	code: 42,
	message: 'Giriş yapılıyken bu işlemi gerçekleştiremezsiniz!',
};

export const OWNER_CANNOT_BE_FOUND: CustomResponse = {
	code: 43,
	message: 'Şirketin yöneticisi bulunamadı!',
};

export const INPUT_NAME: CustomResponse = {
	code: 44,
	message: 'Girilen isim kriterlere uymuyor',
	fields: 'name',
};

export const INPUT_LAST_NAME: CustomResponse = {
	code: 45,
	message: 'Girilen soy isim kriterlere uymuyor',
	fields: 'last_name',
};

export const INPUT_PHONE: CustomResponse = {
	code: 46,
	message: 'Lütfen geçerli bir telefon numarası giriniz',
	fields: 'phone',
};

export const INPUT_ADDRESS: CustomResponse = {
	code: 47,
	message: 'Lütfen geçerli bir adres giriniz',
	fields: 'address',
};

export const INPUT_PASSWORD: CustomResponse = {
	code: 48,
	message:
		'Girilen şifre 8-24 karakter uzunluğunda en az bir büyük bir küçük harf ve sayı içermelidir',
	fields: 'password',
};

export const INPUT_PASSWORD_MATCH: CustomResponse = {
	code: 49,
	message: 'Girilen şifreler birbiriyle uyuşmuyor',
	fields: ['password', 'confirmPassword'],
};

export const INPUT_EMAIL: CustomResponse = {
	code: 50,
	message: 'Lütfen geçerli bir e-posta adresi giriniz',
	fields: 'email',
};

export const API_NOT_FOUND: CustomResponse = {
	code: 51,
	message: 'Cannot find any actions to perform!',
};

export const API_404: CustomResponse = {
	code: 52,
	message: 'Specified path not found on the server',
};

export const SUCCESSFUL_LOGOUT: CustomResponse = {
	code: 53,
	message: 'Başarıyla çıkış yapıldı!',
	error: false,
};

export const ADMIN_ERROR: CustomResponse = {
	code: 54,
	message:
		'Bu işlemi gerçekleştirebilmek için yetkili olmanız gerekmektedir.',
};

export const ALREADY_SUBSCRIBED: CustomResponse = {
	code: 55,
	message: 'Bu abonelik türüne zaten sahipsiniz!',
};

export const SUBSCRIPTION_CHANGED: CustomResponse = {
	code: 56,
	message: 'Abonelik türünüz başarıyla değiştirildi!',
	error: false,
};

export const SUBSCRIPTION_NOT_FOUND: CustomResponse = {
	code: 57,
	message: 'Geçerli bir üyelik bulunamadı. Lütfen destekle iletişime geçin!',
};

export const SLOW_DOWN: CustomResponse = {
	code: 58,
	message: 'Lütfen sunuculara istek gönderirken yavaşlayın!',
};

export const ROLE_CANNOT_BE_FOUND: CustomResponse = {
	code: 59,
	message: 'Belirttiğiniz rol bulunamadı!',
};

export const EMPLOYEE_CREATED: CustomResponse = {
	code: 60,
	message: 'Çalışan profili oluşturuldu',
	error: false,
};

export const EMPLOYEE_CANNOT_BE_FOUND: CustomResponse = {
	code: 61,
	message: 'Çalışan bulunamadı!',
};

export const EMPLOYEE_REMOVED: CustomResponse = {
	code: 62,
	message: 'Çalışan profili başarıyla silindi!',
	error: false,
};

export const EMPLOYEE_REMOVE_FAILED: CustomResponse = {
	code: 63,
	message: 'Çalışan profili silinirken bir hatayla karşılaşıldı!',
};

export const EMPLOYEE_EDIT_FAILED: CustomResponse = {
	code: 64,
	message: 'Çalışan profili düzenlenirken bir hatayla karşılaşıldı!',
};

export const EMPLOYEE_EDITED: CustomResponse = {
	code: 65,
	message: 'Çalışan profili başarıyla düzenlendi!',
	error: false,
};

export const NO_EMPLOYEE_FOUND: CustomResponse = {
	code: 66,
	message: 'Belirtilen şirketin hiçbir çalışan profili bulunamadı!',
};

export const EMPLOYEE_CREATE_FAILED: CustomResponse = {
	code: 67,
	message: 'Çalışan profili oluşturulurken bir hatayla karşılaşıldı!',
};

export const INPUT_USERNAME: CustomResponse = {
	code: 68,
	message:
		'Kullanıcı adı 8-20 karakter arası sadece İngilizce küçük harflerle yazılmalıdır.',
};

export const TABLE_EDIT_FAILED: CustomResponse = {
	code: 69,
	message: 'Masa düzenlenirken bir hatayla karşılaşıldı!',
};

export const TABLE_EDIT_SUCCEEDED: CustomResponse = {
	code: 70,
	message: 'Masa başarıyla düzenlendi!',
	error: false,
};

export const FOOD_EDIT_FAILED: CustomResponse = {
	code: 71,
	message: 'Yiyecek düzenlenirken bir hatayla karşılaşıldı!',
};

export const FOOD_EDIT_SUCCEEDED: CustomResponse = {
	code: 72,
	message: 'Yiyecek başarıyla düzenlendi!',
	error: false,
};

export const COMPANY_EDIT_FAILED: CustomResponse = {
	code: 73,
	message: 'Şirket düzenlenirken bir hatayla karşılaşıldı!',
};

export const COMPANY_EDIT_SUCCEEDED: CustomResponse = {
	code: 74,
	message: 'Şirket başarıyla düzenlendi!',
	error: false,
};

export const CATEGORY_EDIT_FAILED: CustomResponse = {
	code: 75,
	message: 'Kategori düzenlenirken bir hatayla karşılaşıldı!',
};

export const CATEGORY_EDIT_SUCCEEDED: CustomResponse = {
	code: 76,
	message: 'Kategori başarıyla düzenlendi!',
	error: false,
};

export const FAILED_IYZIPAY_INIT_SUBSCRIPTION: CustomResponse = {
	code: 77,
	message: 'Ödeme formu oluşturulamadı!',
};

export const IYZIPAY_INIT_SUBSCRIPTION: CustomResponse = {
	code: 78,
	message: 'Ödeme formu başarıyla oluşturuldu.',
	error: false,
};

export const FAILED_IYZIPAY_RETRIEVE_SUBSCRIPTION: CustomResponse = {
	code: 79,
	message: 'Ödeme formu bilgileri alınırken bir hatayla karşılaşıldı!',
};

export const IYZIPAY_RETRIEVE_SUBSCRIPTION: CustomResponse = {
	code: 79,
	message: 'Ödeme formu bilgileri başarıyla alındı.',
	error: false,
};
