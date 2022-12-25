package com.sivalabs.moviebuffs.core.entity;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "movie_crew")
@Setter
@Getter
@EqualsAndHashCode(of = { "id" }, callSuper = false)
public class CrewMember implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name = "crew_id_generator", sequenceName = "crew_id_seq", allocationSize = 1)
	@GeneratedValue(generator = "crew_id_generator")
	private Long id;

	@JsonProperty("credit_id")
	@Column(name = "credit_id")
	private String creditId;

	private String department;

	private String gender;

	private String uid;

	private String job;

	private String name;

	@JsonProperty("profile_path")
	@Column(name = "profile_path")
	private String profilePath;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "movie_id")
	private Movie movie;

}
