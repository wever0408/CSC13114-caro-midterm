import {Modal} from "antd";

const { confirm } = Modal;

export function ModalOutRoom(onOk){
    Modal.warning({
        title: 'Thông Báo',
        content: 'Đối Thủ Của Bạn Đã Thoát',
        onOk
    });
}

export function ModalRejected(){
    Modal.warning({
        title: 'Thông Báo',
        content: 'Đề Nghị Của Bạn Đã Bị Từ Chối',
    });
}


export function ModalGameEnded(){
    Modal.warning({
        title: 'Thông Báo',
        content: 'Game Đã Kết Thúc. Vui Lòng Tạo Lại Game Mới.',
    });
}

export function ModalWin(){
    Modal.info({
        title: 'Thông Báo',
        content: 'Đối Thủ Của Bạn Đã Đầu Hàng',
    });
}

export function ModalConfirm(title, onOk){
    confirm({
        title,
        // content: 'Some descriptions',
        onOk() {
            onOk()
        },
        onCancel() {}
    });
}

export function ModalConfirmAction(title, onOk, onCancel){
    confirm({
        title,
        content: 'Bạn có đồng ý không ?',
        okText: 'Đồng Ý',
        cancelText: 'Không',
        onOk() {
            onOk()
        },
        onCancel() {
            onCancel()
        }
    });
}

export function ModalWaiting() {
    Modal.info({
        title: 'Đang đợi đối thủ xác nhận...',
        content: '',
        okText:'.',
        onOk() {},
        okButtonProps: {
            disabled: true,
            loading: true
        }
    });
}