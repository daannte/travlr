import Activity from "../activity/Activity";
import AddIcon from "../../assets/add.svg";
import "./Card.css";

function Card() {
    return (
        <>
            <div className="card-container">
                <h1 className="card-day">Day 1</h1>
                <div className="activity-container">
                    <Activity />
                </div>
            </div>
            <button className="add-icon">
                <img src={AddIcon}></img>
            </button>
        </>
    );
}

export default Card;
