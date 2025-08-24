
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <div className="logo-container px-4 py-2 rounded">
                <span className="text-white font-playfair tracking-wider font-semibold">Rivisya</span>
              </div>
            </Link>
            <p className="text-gray-600 text-sm mt-4">
              Menyediakan koleksi perhiasan berkualitas tinggi untuk momen berharga dalam hidup Anda. Setiap perhiasan kami dibuat dengan ketelitian dan keahlian tinggi.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-600 hover:text-gold-DEFAULT transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gold-DEFAULT transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gold-DEFAULT transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="font-playfair font-semibold text-lg mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gold-DEFAULT transition-colors text-sm">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-gold-DEFAULT transition-colors text-sm">
                  Koleksi Perhiasan
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-gold-DEFAULT transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-gold-DEFAULT transition-colors text-sm">
                  Akun Saya
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-1">
            <h3 className="font-playfair font-semibold text-lg mb-4">Kategori</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=rings" className="text-gray-600 hover:text-gold-DEFAULT transition-colors text-sm">
                  Cincin
                </Link>
              </li>
              <li>
                <Link to="/products?category=necklaces" className="text-gray-600 hover:text-gold-DEFAULT transition-colors text-sm">
                  Kalung
                </Link>
              </li>
              <li>
                <Link to="/products?category=earrings" className="text-gray-600 hover:text-gold-DEFAULT transition-colors text-sm">
                  Anting
                </Link>
              </li>
              <li>
                <Link to="/products?category=bracelets" className="text-gray-600 hover:text-gold-DEFAULT transition-colors text-sm">
                  Gelang
                </Link>
              </li>
              <li>
                <Link to="/products?category=watches" className="text-gray-600 hover:text-gold-DEFAULT transition-colors text-sm">
                  Jam Tangan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="font-playfair font-semibold text-lg mb-4">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-gold-DEFAULT mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">
                  Jl. Permata Indah No. 123, Jakarta Selatan, Indonesia
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-gold-DEFAULT mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm">+62 812 3456 7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-gold-DEFAULT mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm">info@permataindah.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Rivisya Aksesoris. Hak Cipta Dilindungi.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gold-DEFAULT text-sm">
                Syarat & Ketentuan
              </a>
              <a href="#" className="text-gray-500 hover:text-gold-DEFAULT text-sm">
                Kebijakan Privasi
              </a>
              <a href="#" className="text-gray-500 hover:text-gold-DEFAULT text-sm">
                Kebijakan Pengembalian
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
