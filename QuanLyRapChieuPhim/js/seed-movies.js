// Seed dữ liệu phim mẫu vào localStorage (dùng chung cho home/admin)
(function () {
  const KEY = "rikkei_movies";

  function updateMovieStatus(movies) {
    const today = new Date();
    for (let i = 0; i < movies.length; i++) {
      if (i > 4) {
        const releaseDate = new Date(movies[i].releaseDate);
        const endDate = new Date(releaseDate);
        endDate.setDate(endDate.getDate() + 30);

        if (today < releaseDate) {
          movies[i].status = "Sắp chiếu";
        } else if (today <= endDate) {
          movies[i].status = "Đang chiếu";
        } else {
          movies[i].status = "Đã chiếu";
        }
      }
    }
  }

  function seedMoviesIfEmpty() {
    const raw = localStorage.getItem(KEY);
    let movies = [];
    try {
      movies = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(movies)) movies = [];
    } catch (e) {
      movies = [];
    }

    const seedMovies = [
      {
        id: 1,
        name: "Dune: Part Two",
        genre: "Khoa học viễn tưởng",
        duration: 166,
        releaseDate: "2024-04-07",
        status: "Đang chiếu",
        price: 90000,
        poster: "../assets/images/Dune Poster.png",
        desc: "Hành trình sử thi tiếp diễn",
        trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
      },
      {
        id: 2,
        name: "Kung Fu Panda 4",
        genre: "Hoạt hình",
        duration: 94,
        releaseDate: "2024-03-08",
        status: "Đang chiếu",
        price: 75000,
        poster: "../assets/images/Kung Fu Panda Poster.png",
        desc: "Po trở lại",
        trailerUrl: "https://www.youtube.com/watch?v=_inKs4eeHiI",
      },
      {
        id: 3,
        name: "Godzilla x Kong",
        genre: "Hành động",
        duration: 115,
        releaseDate: "2024-03-29",
        status: "Đã chiếu",
        price: 95000,
        poster: "../assets/images/Godzilla Poster.png",
        desc: "Cuộc chiến của hai quái vật",
      },
      {
        id: 4,
        name: "Mai",
        genre: "Tình cảm",
        duration: 131,
        releaseDate: "2024-02-10",
        status: "Sắp chiếu",
        price: 80000,
        poster: "../assets/images/Mai Poster.png",
        desc: "Tình yêu tuyệt vời",
      },
      {
        id: 5,
        name: "Exhuma",
        genre: "Kinh dị",
        duration: 134,
        releaseDate: "2024-03-15",
        status: "Đang chiếu",
        price: 85000,
        poster: "../assets/images/Exhuma Poster.png",
        desc: "Bí mật bị chôn dưới lòng đất",
        trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
      },
      {
        id: 6,
        name: "Super Mario Thiên Hà",
        genre: "Hoạt hình",
        duration: 92,
        releaseDate: "2026-04-01",
        status: "Đang chiếu",
        price: 75000,
        poster: "../assets/images/Exhuma Poster.png",
        desc: "Mario phiêu lưu trong thiên hà",
        trailerUrl: "https://www.youtube.com/watch?v=sKGBkP3kNvM",
      },
      {
        id: 7,
        name: "Thunderbolts",
        genre: "Siêu anh hùng",
        duration: 140,
        releaseDate: "2025-05-02",
        status: "Đang chiếu",
        price: 115000,
        poster: "../assets/images/Mai Poster.png",
        desc: "Biệt đội phản anh hùng thực hiện nhiệm vụ nguy hiểm.",
         trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
      },
      {
        id: 8,
        name: "Snow White",
        genre: "Gia đình",
        duration: 120,
        releaseDate: "2025-03-21",
        status: "Đang chiếu",
        price: 90000,
        poster: "../assets/images/Kung Fu Panda Poster.png",
        desc: "Phiên bản live-action của nàng Bạch Tuyết.",
      },
      {
        id: 9,
        name: "Minecraft",
        genre: "Phiêu lưu",
        duration: 110,
        releaseDate: "2025-04-04",
        status: "Đang chiếu",
        price: 95000,
        poster: "../assets/images/Godzilla Poster.png",
        desc: "Thế giới Minecraft bước lên màn ảnh rộng.",
      },
      {
        id: 10,
        name: "Doraemon: Nobita's Earth Symphony",
        genre: "Hoạt hình",
        duration: 115,
        releaseDate: "2024-05-24",
        status: "Đang chiếu",
        price: 75000,
        poster: "../assets/images/Exhuma Poster.png",
        desc: "Doraemon và Nobita trong chuyến phiêu lưu âm nhạc.",
        trailerUrl: "https://www.youtube.com/watch?v=hwN3QpGGEe0",
      },
      {
        id: 11,
        name: "Detective Conan: The Million-dollar Pentagram",
        genre: "Trinh thám",
        duration: 110,
        releaseDate: "2024-04-12",
        status: "Đang chiếu",
        price: 80000,
        poster: "../assets/images/Mai Poster.png",
        desc: "Vụ án mới liên quan đến kho báu bí ẩn.",
      },
      {
        id: 12,
        name: "The First Omen",
        genre: "Kinh dị",
        duration: 119,
        releaseDate: "2024-04-05",
        status: "Đang chiếu",
        price: 85000,
        poster: "../assets/images/Kung Fu Panda Poster.png",
        desc: "Nguồn gốc thế lực tà ác được hé lộ.",
      },
      {
        id: 13,
        name: "Civil War",
        genre: "Hành động",
        duration: 109,
        releaseDate: "2024-04-12",
        status: "Sắp chiếu",
        price: 90000,
        poster: "../assets/images/Godzilla Poster.png",
        desc: "Nước Mỹ rơi vào nội chiến trong tương lai.",
      },
      {
        id: 14,
        name: "Abigail",
        genre: "Kinh dị",
        duration: 109,
        releaseDate: "2024-04-19",
        status: "Đang chiếu",
        price: 85000,
        poster: "../assets/images/Exhuma Poster.png",
        desc: "Con tin hóa ra là thứ đáng sợ hơn.",
      },
      {
        id: 15,
        name: "The Fall Guy",
        genre: "Hành động",
        duration: 126,
        releaseDate: "2024-05-03",
        status: "Đang chiếu",
        price: 95000,
        poster: "../assets/images/Mai Poster.png",
        desc: "Cascadeur bị cuốn vào âm mưu nguy hiểm.",
      },
      {
        id: 16,
        name: "Michael",
        genre: "Tiểu sử",
        duration: 138,
        releaseDate: "2026-04-26",
        status: "Sắp chiếu",
        price: 100000,
        poster: "../assets/images/Kung Fu Panda Poster.png",
        desc: "Cuộc đời của Michael Jackson",
      },
      {
        id: 17,
        name: "Đại Tiệc Trăng Máu 8",
        genre: "Hài",
        duration: 110,
        releaseDate: "2026-04-30",
        status: "Sắp chiếu",
        price: 85000,
        poster: "../assets/images/Godzilla Poster.png",
        desc: "Tiệc tối lạnh người",
      },
      {
        id: 18,
        name: "Heo Năm Móng",
        genre: "Kinh dị",
        duration: 105,
        releaseDate: "2026-04-30",
        status: "Sắp chiếu",
        price: 80000,
        poster: "../assets/images/Exhuma Poster.png",
        desc: "Bí ẩn trong rừng sâu",
      },
      {
        id: 19,
        name: "Toy Story 5",
        genre: "Hoạt hình",
        duration: 95,
        releaseDate: "2026-05-15",
        status: "Sắp chiếu",
        price: 80000,
        poster: "../assets/images/Mai Poster.png",
        desc: "Cuộc phiêu lưu tiếp tục của đồ chơi",
      },
      {
        id: 20,
        name: "Moana 2",
        genre: "Hoạt hình",
        duration: 114,
        releaseDate: "2026-06-20",
        status: "Sắp chiếu",
        price: 75000,
        poster: "../assets/images/Kung Fu Panda Poster.png",
        desc: "Hành trình trên biển tiếp tục",
      },
      {
        id: 21,
        name: "Frozen 3 - Nữ Hoàng Băng Giá 3",
        genre: "Hoạt hình",
        duration: 120,
        releaseDate: "2026-07-10",
        status: "Sắp chiếu",
        price: 80000,
        poster: "../assets/images/Godzilla Poster.png",
        desc: "Elsa và Anna trở lại",
      },
      {
        id: 22,
        name: "Avatar 4",
        genre: "Khoa học viễn tưởng",
        duration: 185,
        releaseDate: "2026-12-18",
        status: "Sắp chiếu",
        price: 130000,
        poster: "../assets/images/Exhuma Poster.png",
        desc: "Thế giới Pandora lần thứ tư",
      },
      {
        id: 23,
        name: "Thám Tử Kiên 2: Lời Nguyền Hoàng Kim",
        genre: "Chính kịch",
        duration: 115,
        releaseDate: "2026-05-30",
        status: "Sắp chiếu",
        price: 85000,
        poster: "../assets/images/Mai Poster.png",
        desc: "Phần tiếp của thám tử Kiên",
      },
      {
        id: 24,
        name: "Avengers: Ngày Tận Thế",
        genre: "Siêu anh hùng",
        duration: 180,
        releaseDate: "2026-11-06",
        status: "Sắp chiếu",
        price: 125000,
        poster: "../assets/images/Kung Fu Panda Poster.png",
        desc: "Cuộc chiến cuối cùng của Avengers",
      },
    ];

    if (movies.length === 0) {
      movies = seedMovies.slice();
      updateMovieStatus(movies);
      localStorage.setItem(KEY, JSON.stringify(movies));
      return;
    }

    // Đồng bộ trailer từ file seed vào localStorage nếu phim đang thiếu trailer.
    const trailerById = seedMovies.reduce((result, movie) => {
      const trailerUrl = String(movie.trailerUrl || movie.trailer || "").trim();
      if (trailerUrl) {
        result[movie.id] = trailerUrl;
      }
      return result;
    }, {});

    let hasChange = false;
    const mergedMovies = movies.map((movie) => {
      const currentTrailer = String(movie.trailerUrl || movie.trailer || "").trim();
      const seedTrailer = trailerById[movie.id];
      if (!seedTrailer) return movie;

      if (!currentTrailer) {
        hasChange = true;
        return { ...movie, trailerUrl: seedTrailer };
      }

      if (currentTrailer !== seedTrailer) {
        hasChange = true;
        return { ...movie, trailerUrl: seedTrailer };
      }

      return movie;
    });

    if (hasChange) {
      localStorage.setItem(KEY, JSON.stringify(mergedMovies));
    }
  }

  window.ensureSeedMovies = seedMoviesIfEmpty;
})();

