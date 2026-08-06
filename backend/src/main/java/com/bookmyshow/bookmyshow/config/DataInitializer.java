package com.bookmyshow.bookmyshow.config;

import com.bookmyshow.bookmyshow.entities.Movie;
import com.bookmyshow.bookmyshow.entities.Show;
import com.bookmyshow.bookmyshow.entities.Theatre;
import com.bookmyshow.bookmyshow.entities.User;
import com.bookmyshow.bookmyshow.entities.dto.Role;
import com.bookmyshow.bookmyshow.repository.MovieRepository;
import com.bookmyshow.bookmyshow.repository.ShowRepository;
import com.bookmyshow.bookmyshow.repository.TheatreRepository;
import com.bookmyshow.bookmyshow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final MovieRepository movieRepository;
    private final TheatreRepository theatreRepository;
    private final ShowRepository showRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            jdbcTemplate.execute("ALTER TABLE movies ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;");
            jdbcTemplate.execute("UPDATE movies SET is_active = true WHERE is_active IS NULL;");
            jdbcTemplate.execute("ALTER TABLE movies ADD COLUMN IF NOT EXISTS banner_url VARCHAR(255);");
        } catch (Exception e) {
            log.warn("Database table migration check warning: {}", e.getMessage());
        }

        if (movieRepository.count() == 0) {
            log.info("Seeding initial active movies...");

            Movie m1 = movieRepository.save(Movie.builder()
                    .title("The Midnight Archive")
                    .description("A sound archivist discovers a reel recorded tomorrow, and follows its impossible clues through one sleepless city.")
                    .genre(List.of("Mystery", "Drama"))
                    .language("English")
                    .durationMinutes(128)
                    .releaseDate(LocalDate.of(2025, 4, 18))
                    .posterUrl("https://image.tmdb.org/t/p/w780/6mJrgK3z5oGQyH2V5W5n5Z0xB3n.jpg")
                    .bannerUrl("https://image.tmdb.org/t/p/w1280/9l1eZiJHmhr5jIlthMdJN5WYoff.jpg")
                    .rating(8.7)
                    .status("now-showing")
                    .isActive(true)
                    .build());

            Movie m2 = movieRepository.save(Movie.builder()
                    .title("Glass House")
                    .description("A family gathering turns into a beautiful, brittle portrait of what people keep from each other.")
                    .genre(List.of("Thriller", "Drama"))
                    .language("English")
                    .durationMinutes(114)
                    .releaseDate(LocalDate.of(2025, 4, 25))
                    .posterUrl("https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg")
                    .bannerUrl("https://image.tmdb.org/t/p/w1280/9l1eZiJHmhr5jIlthMdJN5WYoff.jpg")
                    .rating(8.2)
                    .status("now-showing")
                    .isActive(true)
                    .build());

            Movie m3 = movieRepository.save(Movie.builder()
                    .title("After the Rain")
                    .description("Two strangers share a coat, a long walk, and the kind of afternoon that changes a life.")
                    .genre(List.of("Romance", "Indie"))
                    .language("French")
                    .durationMinutes(106)
                    .releaseDate(LocalDate.of(2025, 5, 2))
                    .posterUrl("https://image.tmdb.org/t/p/w780/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg")
                    .bannerUrl("https://image.tmdb.org/t/p/w1280/9l1eZiJHmhr5jIlthMdJN5WYoff.jpg")
                    .rating(7.9)
                    .status("now-showing")
                    .isActive(true)
                    .build());

            Movie m4 = movieRepository.save(Movie.builder()
                    .title("Orbiting")
                    .description("On the edge of a vanished planet, a cartographer maps the space between memory and gravity.")
                    .genre(List.of("Sci-Fi", "Adventure"))
                    .language("English")
                    .durationMinutes(140)
                    .releaseDate(LocalDate.of(2025, 5, 16))
                    .posterUrl("https://image.tmdb.org/t/p/w780/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg")
                    .bannerUrl("https://image.tmdb.org/t/p/w1280/9l1eZiJHmhr5jIlthMdJN5WYoff.jpg")
                    .rating(8.5)
                    .status("coming-soon")
                    .isActive(true)
                    .build());

            log.info("Seeding initial theatres...");
            Theatre t1 = theatreRepository.save(Theatre.builder()
                    .name("Aurora Picturehouse")
                    .city("San Francisco")
                    .address("Mission District")
                    .totalSeats(120)
                    .build());

            Theatre t2 = theatreRepository.save(Theatre.builder()
                    .name("The Parlor Cinema")
                    .city("San Francisco")
                    .address("Hayes Valley")
                    .totalSeats(90)
                    .build());

            log.info("Seeding initial shows...");
            showRepository.save(Show.builder()
                    .movie(m1)
                    .theatre(t1)
                    .showDate(LocalDate.now())
                    .showTime(LocalTime.of(19, 15))
                    .ticketPrice(18.0)
                    .build());

            showRepository.save(Show.builder()
                    .movie(m2)
                    .theatre(t2)
                    .showDate(LocalDate.now())
                    .showTime(LocalTime.of(20, 30))
                    .ticketPrice(16.5)
                    .build());
        }

        if (!userRepository.existsByEmail("admin@bookmyshow.com")) {
            userRepository.save(User.builder()
                    .name("System Admin")
                    .email("admin@bookmyshow.com")
                    .phone("1234567890")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.Admin)
                    .build());
        }
    }
}
