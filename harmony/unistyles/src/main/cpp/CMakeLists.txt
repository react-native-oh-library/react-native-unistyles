cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)
set(NATIVERENDER_ROOT_PATH ${CMAKE_CURRENT_SOURCE_DIR})

file(GLOB rnoh_unistyles_SRC CONFIGURE_DEPENDS *.cpp)
add_library(rnoh_unistyles SHARED ${rnoh_unistyles_SRC})
target_include_directories(rnoh_unistyles PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(rnoh_unistyles PUBLIC rnoh)
target_link_libraries(rnoh_unistyles PUBLIC libace_napi.z.so)
