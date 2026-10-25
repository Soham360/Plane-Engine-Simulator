# AERO — Plane Engine Simulator

An interactive, customizable jet-engine workbench inspired by the AXIS Robot Arm Simulator. Built with vanilla JavaScript and Three.js; no package install is required. Three.js is bundled locally, so the 3D view does not depend on a CDN.

## Explore

- Orbit and zoom an animated 3D turbofan or turbojet, switch camera views, and inspect components by clicking or using the component arrows.
- Toggle the housing cutaway, airflow particles and exploded assembly.
- Choose airliner, business-jet or turbojet presets; customize intake diameter, bypass ratio, compressor stages, pressure ratio, turbine inlet temperature and housing finish.
- Adjust throttle, altitude and flight Mach; start and shut down the engine with gradual rotor spool response.
- Read live net thrust, fan RPM, fuel flow, exhaust temperature, mass flows and core station temperatures.
- Review a 60-second thrust trace and export its readings to CSV.
- Save a named build as JSON, reopen it, or resume the last build from local browser storage.

## Run locally

Requires Node.js 18 or later. Run `npm start` and open http://127.0.0.1:5173. Run `npm test` for model and build-validation tests. `npm run build` copies the deployable static site into `dist/`.

To host on GitHub Pages, select **Settings → Pages → Deploy from a branch → main / (root)**. All asset URLs are relative, so repository subpath hosting works. The Sites hosting manifest is independent of GitHub Pages.

## Model and limitations

This is an educational visualization, not an aircraft engineering tool. It uses an ISA troposphere/isothermal lower-stratosphere approximation and a simplified separate-flow Brayton cycle with fixed component efficiencies, compressor/fan shaft work, turbine power balance, a fuel energy balance and pressure-matched nozzle velocities. Thrust is outgoing momentum minus inlet momentum. Inlet mass flow and rotor RPM use illustrative scaling relationships. Compressor stage count changes assumed efficiency; its geometry is procedural.

It excludes choking, component maps, surge, detailed nozzle pressure thrust, thermal limits, installation losses, afterburners, variable gas properties and real aircraft calibration. Fuel consumption and thrust are estimates, especially at high Mach or extreme settings. Throttle zero means idle; Shut down engine commands zero rotor speed. Pause freezes rotor and airflow animation while calculations and telemetry continue. Camera and exploded assembly transitions use interruptible, time-based springs. Selected parts receive a visible tint, outline and anchored label. Reset offers a persistent Undo reset action that restores the previous build, flight conditions, run state, view settings and telemetry. Engine operation, pause state and view options are not saved in build files.

Keyboard: Tab to controls; arrow keys adjust sliders and switch workbench tabs. Reduced-motion preferences suppress rotor/airflow animation and spatial transitions while live readings remain active. Preference changes are respected immediately, including after Reset. Controls provide at least 44 CSS pixel hit areas, scalable text, stronger contrast and reduced-transparency/high-contrast fallbacks. The 3D viewer needs WebGL; the numeric model remains usable if rendering is unavailable.

## Credits

Three.js and OrbitControls use the MIT license in `vendor/THREE-LICENSE.txt`. The workbench layout is inspired by Soham360's Robot-Arm-Simulator. All engine geometry is generated in this project.

## Workspace layout

The simulator uses a viewport-sized dashboard inspired by the wind tunnel simulator. The engine, live readings, scene toggles, component explanation and thrust graph fit alongside the active control tab on desktop. How it works opens a separate reading view without resetting the engine. On narrow screens, Engine & data / Controls switches between panes, with Component / Thrust graph instrument tabs. Very short displays or enlarged text retain contained scrolling so controls stay accessible.


## Detailed engine assemblies and named engines

The procedural model now uses swept, twisted airfoil fan blades and instanced compressor/turbine blade rows, alternating fixed vanes, rotor disks, flanged cases and bolts, acoustic intake lining, annular combustor liners with cooling-hole details, fuel manifold and injectors, concentric shafts with bearing elements, accessory drive/pumps/oil-system hardware, exhaust frame/cone and bypass cowl. Major modules have separate ownership, transforms and selection materials. Up to fifteen assemblies can be inspected using the component picker, 3D picking or numbered exploded-view buttons. Inactive modules are omitted for architectures that do not use them.

Exploded mode separates the gas-path modules axially and offsets the cowl, shafts, accessories and fuel system radially, with guide lines and automatic camera framing. Stationary vane rows do not rotate. Airflow is hidden while the gas path is disconnected. Animation, camera transitions and reassembly retain reduced-motion support.

Named presets: CFM56-7B (737NG), GE90-115B (777), and Trent XWB (A350). Their published fan blade counts, shaft arrangements and compressor/turbine stage topology inform the geometry. Named engine identity is included in build JSON. Public manufacturer and technical-reference links appear under How it works → Real engines.

These are original educational reconstructions, not manufacturer CAD, complete maintenance assemblies or licensed digital twins. Internal contours, non-fan blade counts, fasteners, service equipment, proportions and materials are illustrative. Changing geometry creates a modified study of the named engine. Thrust, fuel flow, temperatures and RPM remain the simplified teaching model rather than published engine performance; the temperature and pressure sliders are educational cycle inputs, not real operating limits.


Inspection controls: drag **Separate** for continuous 0–100% assembly separation. **Focus part** frames the selected module; **Fit engine** returns to the complete model. Transitions can be interrupted and respect reduced motion.
