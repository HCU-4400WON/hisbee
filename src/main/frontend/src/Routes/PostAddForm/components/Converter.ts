export const dataConverter = (what: string, info?: string | Date) => {
  if (what === "year") {
    let year = ((info as Date).getFullYear() + "").padStart(2, "0");
    let month = ((info as Date).getMonth() + 1 + "").padStart(2, "0");
    let date = ((info as Date).getDate() + "").padStart(2, "0");
    let convertedDate = year + "-" + month + "-" + date;
    // console.log("이거? " ,convertedDate);
    return convertedDate;
  } else if (what === "dateTime") {
    if (!info) return null;
    let year = (new Date(info as string).getFullYear() + "").padStart(2, "0");
    let month = (new Date(info as string).getMonth() + 1 + "").padStart(2, "0");
    let date = (new Date(info as string).getDate() + "").padStart(2, "0");
    let convertedDate = year + "-" + month + "-" + date;
    // console.log("이거? " ,convertedDate);
    return convertedDate;
  }
};

export const stateConverter = (type: string, data: any) => {
  if (type === "duration") {
    if (
      [
        "미설정",
        "봄학기",
        "가을학기",
        "여름방학",
        "겨울방학",
        "1년",
        "1학기",
        "2학기",
        "3학기",
        "4학기",
      ].includes(data)
    ) {
      return data;
    }
    return "직접 입력";
  } else if (type === "durationText") {
    if (
      [
        "미설정",
        "봄학기",
        "가을학기",
        "여름방학",
        "겨울방학",
        "1년",
        "1학기",
        "2학기",
        "3학기",
        "4학기",
      ].includes(data)
    ) {
      return "";
    }
    return data;
  } else if (type === "postTypes") {
    let newDate = [...data];
    const judge = (object: any) =>
      [
        "동아리",
        "학회",
        "프로젝트",
        "학술모임",
        "공모전/대회",
        "운동/게임/취미",
        "전공 스터디",
      ].includes(object);

    for (let i = 0; i < newDate.length; ++i) {
      if (judge(newDate[i]) === false) {
        newDate.splice(i, 1);
        newDate.push("기타 모임");
        return newDate;
      }
    }

    return newDate;
  } else if (type === "categoryETC") {
    const judge = (object: any) =>
      [
        "동아리",
        "학회",
        "프로젝트",
        "학술모임",
        "공모전/대회",
        "운동/게임/취미",
        "전공 스터디",
      ].includes(object);

    for (let i = 0; i < data.length; ++i) {
      if (judge(data[i]) === false) {
        return data[i];
      }
    }
    return "";
  } else if (type === "keywords") {
    // console.log("before", data);
    const newKeywords = data?.keywords?.filter((elem: string) => {
      const list = [
        ...data?.postTypes,
        ...data?.tags?.first,
        ...data?.tags?.second,
      ];
      // console.log("comp", list, elem);
      // console.log(list.includes(elem));
      if (list.includes(elem) === true) return false;
      else return true;
    });
    // console.log("after", newKeywords);
    return newKeywords;
  }
};
