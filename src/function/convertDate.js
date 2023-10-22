const formatDate = (date) => {
    const inputDate = new Date(date);

    // Масиви для назв місяців та ампм
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const ampm = ["am", "pm"];

    // Отримання дня, місяця, року, години та хвилини
    const day = inputDate.getDate();
    const month = months[inputDate.getMonth()];
    const year = inputDate.getFullYear();
    let hours = inputDate.getHours();
    const minutes = inputDate.getMinutes();
    const ampmIndex = hours < 12 ? 0 : 1;

    // Конвертація годин у 12-годинний формат
    if (hours > 12) {
        hours -= 12;
    }

    // Створення рядка зі сформованою датою
    const formattedDate = `${day} ${month} ${year} ${hours}:${minutes.toString().padStart(2, '0')} ${ampm[ampmIndex]}`;

    return formattedDate;

}

export default formatDate;