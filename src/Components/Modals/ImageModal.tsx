import Modal from "./Modal";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  src,
  alt,
  title,
}: ImageModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-fit"
    >
      <div className="p-6 flex items-center justify-center bg-base-200/50 rounded-b-2xl">
        <img
          src={src}
          alt={alt}
          className=" max-h-[70vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </Modal>
  );
}
