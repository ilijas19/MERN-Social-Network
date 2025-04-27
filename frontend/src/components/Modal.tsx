type ModalProps = {
  isModalOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ isModalOpen, onClose, children }: ModalProps) => {
  return (
    isModalOpen && (
      <div
        style={{
          background: "rgba(0,0,0,0.5)",
        }}
        onClick={() => onClose()}
        className="fixed inset-0   flex justify-center "
      >
        {children}
      </div>
    )
  );
};
export default Modal;
