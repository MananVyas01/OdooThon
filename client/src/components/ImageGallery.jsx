import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Download } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

const ImageGallery = ({ images = [], itemTitle = 'Item' }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Handle case where images is empty or undefined
  const imageList = images?.length > 0 ? images : [{ url: '/api/placeholder/400/400', alt: 'No image available' }];

  const openModal = (index) => {
    setSelectedImage(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsZoomed(false);
  };

  const goToPrevious = () => {
    setSelectedImage(prev => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedImage(prev => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={imageList[selectedImage]?.url}
            alt={imageList[selectedImage]?.alt || itemTitle}
            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => openModal(selectedImage)}
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {selectedImage + 1} / {imageList.length}
          </div>
          <div className="absolute bottom-2 right-2">
            <button
              onClick={() => openModal(selectedImage)}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {imageList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {imageList.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === selectedImage
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt || `${itemTitle} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Swiper Carousel for Mobile */}
      <div className="md:hidden">
        <Swiper
          modules={[Navigation, Pagination, Zoom, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          zoom={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          className="rounded-lg"
        >
          {imageList.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="swiper-zoom-container">
                <img
                  src={image.url}
                  alt={image.alt || `${itemTitle} ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </Swiper>
      </div>

      {/* Modal for Full-Size Image Viewing */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-screen p-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Download Button */}
            <button
              onClick={() => downloadImage(imageList[selectedImage]?.url, `${itemTitle}-${selectedImage + 1}.jpg`)}
              className="absolute bottom-4 left-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full z-10"
            >
              <Download className="w-5 h-5" />
            </button>

            {/* Zoom Toggle */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute bottom-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full z-10"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            {/* Main Image */}
            <div className="flex items-center justify-center h-full">
              <img
                src={imageList[selectedImage]?.url}
                alt={imageList[selectedImage]?.alt || itemTitle}
                className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
                  isZoomed ? 'scale-150 cursor-move' : 'cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {imageList.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
