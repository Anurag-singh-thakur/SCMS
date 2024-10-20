import { useNavigate } from 'react-router-dom';

const handleToggleDescription = (id) => {
    setExpanded((prevExpanded) => ({
        ...prevExpanded,
        [id]: !prevExpanded[id]
    }));
};

const handleAddClick = () => {
    setShowPopup(true);
};

const handlePopupClose = () => {
    setShowPopup(false);
    setNewSubject('');
    setNewDescription('');
    setImgUrl(null);
};

const handleSubjectChange = (e) => {
    setNewSubject(e.target.value);
};

const handleDescriptionChange = (e) => {
    setNewDescription(e.target.value);
};

const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
        const dataToSend = {
            subjectname: newSubject,
            coverImg: imgUrl,
            description: newDescription,
        };

        const response = await fetch('/api/s/subject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
            credentials: 'include',
        });

        const data = await response.json();
        if (response.ok) {
            setSubject((prevSubjects) => [...prevSubjects, data.subject]);  
            handlePopupClose();
        } else {
            console.error("Failed to add subject:", data.error || "Unknown error");
        }
    } catch (error) {
        console.error("Error:", error);
    }
    handlePopupClose();
};
const getNextClassTime = (subject) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    if (subject && subject.length > 0) {
        const upcomingClass = subject.find((classItem) => {
            if (!classItem.time) return false;
            const [time, period] = classItem.time.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours < 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            const classTime = hours * 60 + minutes;
            return classTime > currentTime;
        });

        return upcomingClass ? upcomingClass.time : 'No upcoming classes';
    }
    return 'No upcoming classes';
};



const deleteClass = async (id) => {
    try {
        const res = await fetch(`/api/s/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        const data = await res.json();
        if (data.err) {
            console.log(data.err);
        } else {
            setSubject(subject.filter((classItem) => classItem._id !== id));
        }
    } catch (error) {
        console.log(error);
    }
};

export {
    handleToggleDescription,
    handleAddClick,
    handlePopupClose,
    handleSubjectChange,
    handleDescriptionChange,
    handleFormSubmit,
    getNextClassTime,
    deleteClass,
}