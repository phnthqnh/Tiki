import 'bootstrap-icons/font/bootstrap-icons.css'

function Star(props){
    let star=[]
    if (props.st < 0){
        return
    }
    for(let i = 1; i <= props.st; i++){
        star.push (<i className="text-warning bi bi-star-fill"></i>)
    }
    if(star.length < 5){
        while (star.length < 5) {
            star.push(<i className="bi bi-star-fill" style={{color: "#d9d9d9"}}></i>)
        }
    }
    return(star)
}

export default Star

