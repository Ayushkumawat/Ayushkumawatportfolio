import Particles from "react-tsparticles"
import {loadFull} from 'tsparticles'
import { useCallback, useMemo, useContext } from "react"
import { ThemeContext } from "../../ThemeContext";
import React from "react";

// Use React.memo to prevent unnecessary re-renders
const ParticlesBackground = React.memo(() => {
    const { darkMode } = useContext(ThemeContext);
    
    // Initialize particles only once
    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

    // Memoize the particle options to prevent re-creation on render
    const particleOptions = useMemo(() => ({
        particles: {
            number: {
                value: 5,
                density: {
                    enable: true,
                    value_area: 130
                }
            },
            color: {
                value: darkMode ? "#bcc2ef": "ff002f"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 5,
                    color: darkMode ? "#0a030f" : "#bfbcc0"
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 1,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.5,
                    opacity_min: 1,
                    sync: false
                }
            },
            size: {
                value: 4,
                random: false,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 130,
                color: darkMode ? "#cdc8f1" : "#04041a",
                opacity: 0.9,
                width: 1
            },
            move: {
                enable: true,
                speed: 1.1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: true,
                attract: {
                    enable: false,
                    rotateX: 1200,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 400,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 121,
                    duration: 0.4
                },
                push: {
                    particles_nb: 0
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true,
        fps_limit: 60,
        detectRetina: true
    }), [darkMode]);

    return (
        <div className="particles-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
            <Particles
                id="tsparticles"
                options={particleOptions}
                init={particlesInit}
            />
        </div>
    )
});

export default ParticlesBackground;