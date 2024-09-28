function Dong(props) {
    let cur = new Intl.NumberFormat('vi-VN').format(props.val)
    return (
        <>
            <span style={{ fontSize: '20px'}}>{cur}</span>
            <span style={{ fontSize: '14.5px', verticalAlign:'super'}}>₫</span>
        </>
    )
}

export default Dong